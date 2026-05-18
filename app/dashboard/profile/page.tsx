import { Metadata } from 'next';
import ProfilePage from '@/frontend/components/pages/ProfilePage';

export const metadata: Metadata = {
  title: 'Hồ sơ — Smart Kitchen VN',
  description: 'Xem và chỉnh sửa thông tin hồ sơ cá nhân của bạn.',
};

export default function ProfileRoute() {
  return <ProfilePage />;
}
