import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '@/utils/auth';

export const checkPermission = (requiredPermissions: string[]) => {
  return async (request: Request) => {
    try {
      const authHeader = request.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return { success: false, error: 'No token provided' };
      }

      const token = authHeader.split(' ')[1];
      const decoded = await verifyToken(token);

      if (!decoded || !decoded.userId) {
        return { success: false, error: 'Invalid token' };
      }

      const { db } = await connectToDatabase();
      
      const user = await db.collection('users').findOne(
        { _id: new ObjectId(decoded.userId) },
        { projection: { permissions: 1 } }
      );

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const userPermissions = user.permissions || ['user'];
      const hasPermission = requiredPermissions.some(permission => 
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return { success: false, error: 'Insufficient permissions' };
      }

      return { success: true, user };
    } catch (error) {
      console.error('Permission check failed:', error);
      return { success: false, error: 'Authorization failed' };
    }
  };
};

export type AuthCheckResult = {
  success: boolean;
  error?: string;
  user?: {
    _id: string;
    permissions: string[];
  };
};
