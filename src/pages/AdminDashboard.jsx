import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { Job } from "@/entities/Job";
import { Rating } from "@/entities/Rating";
import { Blacklist } from "@/entities/Blacklist";
import { Button } from "@/components/ui/button";
import {
  Shield,
  AlertTriangle,
  Users,
  Ban,
  Bell,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Loader2,
  Settings,
  Plus,
  Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { HexStat, HexGrid } from "@/components/ui/hexagon";

// Quick Action Card
function QuickAction({ icon: Icon, title, subtitle, actionLabel, variant = "default", onClick }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
      <div className={`w-12 h-12 hexagon-pointy flex items-center justify-center ${
        variant === 'warning' ? 'bg-[var(--primary)]' : 'bg-[var(--surface-secondary)]'
      }`}>
        <Icon className={`w-5 h-5 ${variant === 'warning' ? 'text-white' : 'text-[var(--primary)]'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[var(--text-primary)]">{title}</h4>
        <p className="text-sm text-[var(--text-muted)] truncate">{subtitle}</p>
      </div>
      <Button 
        size="sm" 
        onClick={onClick}
        className={variant === 'warning' 
          ? 'bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white' 
          : 'bg-transparent border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
        }
      >
        {actionLabel}
      </Button>
    </div>
  );
}

// Activity Item
function ActivityItem({ title, subtitle, hasIndicator = false }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[var(--border)] last:border-0">
      {hasIndicator && (
        <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
      )}
      {!hasIndicator && <div className="w-2" />}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--text-primary)]">{title}</p>
        <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    reports: 0,
    blacklist: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await User.me();
      setCurrentUser(userData);

      if (userData.user_type !== 'admin') {
        navigate(createPageUrl("Dashboard"));
        return;
      }
      
      const [allUsers, allJobs, allRatings, allBlacklist] = await Promise.all([
        User.list("-created_date"),
        Job.list("-created_date"),
        Rating.list("-created_date"),
        Blacklist.list("-created_date")
      ]);

      setStats({
        totalUsers: allUsers.filter(u => u.user_type !== 'admin').length,
        activeJobs: allJobs.filter(j => j.status === 'open' || j.status === 'in_progress').length,
        reports: allRatings.filter(r => r.rating <= 2).length,
        blacklist: allBlacklist.length
      });

    } catch (error) {
      console.error("Error loading admin data:", error);
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin mb-4" />
        <p className="text-[var(--text-secondary)]">A carregar painel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      {/* Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 hexagon-pointy bg-[var(--primary)] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--primary)]">KANDU</h1>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Admin Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="relative">
              <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--error)] rounded-full" />
            </Button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-orange-500 flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 py-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h2>
            <h3 className="text-2xl font-bold text-[var(--text-primary)]">Overview</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Last updated: 2m ago</p>
        </div>
      </div>

      {/* Hexagon Stats - Diamond Pattern */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-0">
          {/* Row 1 */}
          <div className="transform translate-y-0">
            <HexStat
              icon={<Users className="w-6 h-6" />}
              label="Total Users"
              value={stats.totalUsers.toLocaleString()}
              trend="up"
              trendValue="+5%"
              sparkline
            />
          </div>
          <div className="transform translate-y-12">
            <HexStat
              icon={<Briefcase className="w-6 h-6" />}
              label="Projects"
              value={stats.activeJobs}
              trend="neutral"
              trendValue="0%"
              sparkline
            />
          </div>
          
          {/* Row 2 */}
          <div className="transform -translate-y-8">
            <HexStat
              icon={<AlertTriangle className="w-6 h-6" />}
              label="Reports"
              value={stats.reports}
              trend="up"
              trendValue="+20%"
              sparkline
            />
          </div>
          <div className="transform translate-y-4">
            <HexStat
              icon={<Ban className="w-6 h-6" />}
              label="Blacklist"
              value={stats.blacklist}
              trend="down"
              trendValue="-1%"
              sparkline
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[var(--text-primary)]">Quick Actions</h3>
          <button className="text-[var(--primary)] text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          <QuickAction
            icon={AlertTriangle}
            title="Review Flagged User"
            subtitle="High Priority • User #8821"
            actionLabel="Review"
            variant="warning"
          />
          <QuickAction
            icon={Briefcase}
            title="Approve Project"
            subtitle="Project ID #90210"
            actionLabel="Approve"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mt-8">
        <h3 className="font-bold text-[var(--text-primary)] mb-4">Recent Activity</h3>
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] px-4">
          <ActivityItem
            title="New worker verification pending"
            subtitle="Worker: John Doe • 10 mins ago"
            hasIndicator
          />
          <ActivityItem
            title="Payment processed successfully"
            subtitle="Project #8821 • €4,200 • 1 hour ago"
            hasIndicator
          />
          <ActivityItem
            title="New project submitted"
            subtitle="Downtown Renovation • 2 hours ago"
          />
        </div>
      </div>

      {/* Bottom Nav Tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--border)] px-4 py-2 md:hidden">
        <div className="flex items-center justify-around">
          {[
            { id: 'overview', icon: Shield, label: 'Overview' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'projects', icon: Plus, label: 'Projects', isFab: true },
            { id: 'alerts', icon: Bell, label: 'Alerts' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-colors ${
                tab.isFab ? '' : activeTab === tab.id 
                  ? 'text-[var(--primary)] bg-[var(--primary)]/10' 
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {tab.isFab ? (
                <div className="w-12 h-12 -mt-8 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg" style={{ boxShadow: '0 4px 20px rgba(255, 122, 0, 0.5)' }}>
                  <Plus className="w-6 h-6 text-white" />
                </div>
              ) : (
                <tab.icon className="w-5 h-5" />
              )}
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}