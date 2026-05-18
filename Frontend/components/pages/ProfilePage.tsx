'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  UtensilsCrossed,
  Edit3,
} from 'lucide-react';
import Button from '@/Frontend/components/ui/Button';
import Modal from '@/Frontend/components/ui/Modal';
import Skeleton from '@/Frontend/components/ui/Skeleton';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center gap-2 p-5 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
      {icon}
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-xs text-zinc-400 text-center">{label}</p>
  </div>
);

const ProfilePage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Placeholder display name state — TODO: sync with /api/user/profile
  const [displayName, setDisplayName] = useState('');

  if (!isLoaded) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        <div className="flex items-center gap-4">
          <Skeleton variant="avatar" width="80px" height="80px" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="200px" />
            <Skeleton variant="text" width="150px" />
          </div>
        </div>
        <Skeleton variant="card" height="120px" />
      </div>
    );
  }

  if (!user) return null;

  const fullName = user.fullName ?? user.username ?? 'Người dùng';
  const email = user.primaryEmailAddress?.emailAddress ?? '';
  const joinedDate = new Date(user.createdAt ?? Date.now()).toLocaleDateString(
    'vi-VN',
    { day: '2-digit', month: '2-digit', year: 'numeric' }
  );

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {user.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-orange-500/40"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center ring-2 ring-orange-500/40">
              <User size={32} className="text-orange-400" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h1 className="text-xl font-bold text-white truncate">{fullName}</h1>

          <div className="mt-2 space-y-1.5">
            <p className="flex items-center justify-center sm:justify-start gap-2 text-sm text-zinc-400">
              <Mail size={14} className="flex-shrink-0 text-zinc-500" />
              <span className="truncate">{email}</span>
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-2 text-sm text-zinc-400">
              <Calendar size={14} className="flex-shrink-0 text-zinc-500" />
              <span>Tham gia từ {joinedDate}</span>
            </p>
          </div>

          <div className="mt-4">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Edit3 size={14} />}
              onClick={() => {
                setDisplayName(fullName);
                setIsEditModalOpen(true);
              }}
              className="bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
            >
              Chỉnh sửa hồ sơ
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          Thống kê
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {/* TODO: fetch từ /api/user/profile sau khi có API */}
          <StatCard
            icon={<UtensilsCrossed size={20} />}
            label="Công thức đã tạo"
            value={0}
          />
          <StatCard
            icon={<BookOpen size={20} />}
            label="Cookbook"
            value={0}
          />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa hồ sơ"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Tên hiển thị
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nhập tên hiển thị..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
          </div>

          {/* TODO: submit tới /api/user/profile sau khi có API */}
          <p className="text-xs text-gray-400 italic">
            * Tính năng chỉnh sửa hồ sơ sẽ được kích hoạt khi API sẵn sàng.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
            >
              Lưu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
