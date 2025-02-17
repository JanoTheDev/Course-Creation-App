import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { checkPermission } from "@/middleware/checkPermission";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import Course from "@/models/Course";
import User from "@/models/User";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params before using them
    const id = (await params).id;

    const { db } = await connectToDatabase();

    // Get user from token
    const authHeader = request.headers.get("Authorization");
    let isAdmin = false;
    let userAccessibleCourses: ObjectId[] = [];

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          userId: string;
        };
        const user = await db
          .collection("users")
          .findOne({ _id: new ObjectId(decoded.userId) });

        isAdmin = user?.permissions?.includes("admin") || false;

        // Get the accessible courses as ObjectId[]
        userAccessibleCourses = (user?.accessibleCourses || []).map(
          (ac: { courseId: ObjectId }) => ac.courseId
        );
      } catch (error) {
        console.error("Token verification failed:", error);
      }
    }

    // Validate ID format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    // Convert courseId string to ObjectId
    const courseId = new ObjectId(id);

    // Fetch course
    const course = await db.collection("courses").findOne({ _id: courseId });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Determine access level
    let hasAccess = false;
    if (course.privacy === "public" && course.price === 0) {
      hasAccess = true;
    } else {
      // Check if the user has access by comparing ObjectId
      hasAccess =
        isAdmin || userAccessibleCourses.some((id) => id.equals(courseId));
    }

    return NextResponse.json({ ...course, hasAccess });
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id; 
    if (!params || !id) {
      return NextResponse.json({ error: "Missing course ID" }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }
    const courseId = new ObjectId(id);

    const authCheck = await checkPermission(["admin", "manage_courses"])(
      request
    );
    if (!authCheck.success) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const updates = await request.json();

    const { db } = await connectToDatabase();

    // Add updatedAt timestamp
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    // Prevent modifying _id
    delete updateData._id;

    const result = await db.collection("courses").findOneAndUpdate(
      { _id: new ObjectId(courseId) },
      { $set: updateData },
      { returnDocument: "after" } // Try changing to `returnNewDocument: true` if needed
    );

    console.log("MongoDB Update Result:", result);

    if (!result) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      course: result.value,
    });
  } catch (error) {
    console.error("Failed to update course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check permissions
    const authCheck = await checkPermission(["admin", "manage_courses"])(
      request
    );
    if (!authCheck.success) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const id = (await params).id;
    const { db } = await connectToDatabase();

    // Delete the course
    const result = await db.collection("courses").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Also delete associated videos
    await db.collection("videos").deleteMany({
      courseId: new ObjectId(id),
    });

    return NextResponse.json({
      success: true,
      message: "Course and associated videos deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
