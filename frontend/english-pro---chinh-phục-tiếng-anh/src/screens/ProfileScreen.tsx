import React, { useEffect, useState } from 'react';
import { fetchStats } from '../api';
import ProgressBar from '../components/ProgressBar';

const ProfileScreen: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="relative">
            <div
              className="size-32 rounded-full bg-cover bg-center border-4 border-white shadow-lg ring-1 ring-slate-100"
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJ8CBGA1-yR_GwVy3uo7jQa8ZKDqxldnS9i5SjBAVKfrA0tsPsvBw6pcOfrR1dbBR-nuBOkAboAT3OuaZyIHpElStxS5YiuyjQe1jU6b73yCdndhUh1UKmyMA-zvHLDONLQl-d-WTirbnyDpa6xxbHuTv8zeoBf2gzw_XDkIddu_bgUAIWGnwq1bAiOMVAmrDWOvqEs-996DEl3eO2_8Te6lOUGvIwGvKGmp9xq5FjEaiSVrL7UOc7DI_oUvUXWayjcj90fbtaYB12')` }}
            />
            <div className="absolute bottom-1.5 right-1.5 bg-green-500 size-5 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Dư Nhật Anh</h1>
              <p className="text-slate-500 font-bold uppercase text-[11px] tracking-widest mt-1">Học viên tiếng Anh cấp độ B1</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">mail</span>
                <span>nhatanhdu@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                <span>Tham gia: 20/10/2023</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg text-primary text-xs font-black">
                <span className="material-symbols-outlined text-[18px]">flag</span>
                <span>MỤC TIÊU: TOEIC 750+</span>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 hover:border-primary hover:text-primary transition-all font-black text-sm active:scale-95">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Chỉnh sửa hồ sơ
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Số bài đã học', value: stats.completedLessons.toString(), icon: 'menu_book', color: 'text-blue-500' },
          { label: 'Chuỗi ngày học', value: `${stats.streak} ngày`, icon: 'local_fire_department', color: 'text-orange-500' },
          { label: 'Tổng thời gian', value: `${stats.totalMinutes} phút`, icon: 'schedule', color: 'text-purple-500' },
          { label: 'Thử thách', value: '02 hoàn thành', icon: 'emoji_events', color: 'text-yellow-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2 transition-transform hover:-translate-y-1">
            <div className={`flex items-center gap-2 ${stat.color} text-[10px] font-black uppercase tracking-widest`}>
              <span className="material-symbols-outlined text-[18px]">{stat.icon}</span>
              {stat.label}
            </div>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900">Tiến độ kỹ năng</h3>
              <button className="text-[11px] text-primary font-black uppercase tracking-wider hover:underline">Chi tiết</button>
            </div>
            <div className="space-y-6">
              {stats.skills.map((skill: any) => (
                <ProgressBar
                  key={skill.name}
                  label={skill.name}
                  progress={skill.value}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black mb-6">Cài đặt nhanh</h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-primary rounded-xl">
                    <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                  </div>
                  <span className="font-bold text-slate-700">Nhắc học hằng ngày</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex-1">
            <h3 className="text-lg font-black mb-8">Hoạt động gần đây</h3>
            <div className="relative pl-6 border-l-2 border-slate-100 space-y-8">
              {[
                { id: '1', title: 'Hoàn thành bài học đầu tiên', timestamp: 'Vừa xong', type: 'success' },
                { id: '2', title: 'Cập nhật mục tiêu học tập', timestamp: '1 giờ trước', type: 'primary' },
              ].map((activity) => (
                <div key={activity.id} className="relative group">
                  <span className={`absolute -left-[33px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-white shadow-sm
                    ${activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'primary' ? 'bg-primary' :
                        activity.type === 'warning' ? 'bg-orange-400' : 'bg-slate-300'}`} />
                  <div className="flex flex-col gap-1 transition-transform group-hover:translate-x-1">
                    <p className="text-sm font-bold text-slate-800">{activity.title}</p>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">{activity.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-3 text-[11px] text-slate-400 font-black uppercase tracking-widest hover:text-primary transition-colors border-t border-slate-50">
              Xem lịch sử đầy đủ
            </button>
          </div>
        </div>
      </div>

      <footer className="py-8 text-center text-slate-400 text-[11px] font-black uppercase tracking-widest">
        <p>© 2023 English Pro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ProfileScreen;
