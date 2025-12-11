import { useState, useEffect } from 'react';
import { AuthView } from './AuthView';
import { Dashboard } from './Dashboard';
import { LearnView } from './LearnView';
import { LessonView } from './LessonView';
import { ProfileView } from './ProfileView';
import { LeaderboardView } from './LeaderboardView';
import { QuestsView } from './QuestsView';
import { MiniGamesView } from './MiniGamesView';
import { Navigation } from '@/components/Navigation';
import { User, UserStats, LessonResult } from '@/types';
import { storageService } from '@/services/storageService';
import { subjects, getSubjectById } from '@/data/subjects';

type View = 'home' | 'learn' | 'lesson' | 'leaderboard' | 'quests' | 'profile' | 'games';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats>(storageService.getStats());
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<{ unitId: string; levelId: string; isDailyMix: boolean } | null>(null);

  useEffect(() => {
    const savedUser = storageService.getUser();
    if (savedUser) {
      setUser(savedUser);
      setStats(storageService.getStats());
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setStats(storageService.getStats());
  };

  const handleLogout = () => {
    storageService.clearUser();
    setUser(null);
    setCurrentView('home');
  };

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setCurrentView('learn');
  };

  const handleStartLevel = (unitId: string, levelId: string) => {
    setLessonData({ unitId, levelId, isDailyMix: false });
    setCurrentView('lesson');
  };

  const handleStartDailyMix = () => {
    setLessonData({ unitId: 'daily', levelId: 'mix', isDailyMix: true });
    setCurrentView('lesson');
  };

  const handleLessonComplete = (result: LessonResult) => {
    setStats(storageService.getStats());
    setLessonData(null);
    setCurrentView('home');
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'learn' && !selectedSubjectId) {
      setCurrentView('home');
    } else {
      setCurrentView(tab as View);
    }
  };

  if (!user) {
    return <AuthView onLogin={handleLogin} />;
  }

  if (currentView === 'lesson' && lessonData) {
    return (
      <LessonView
        subjectId={selectedSubjectId || 'quantitative'}
        unitId={lessonData.unitId}
        levelId={lessonData.levelId}
        isDailyMix={lessonData.isDailyMix}
        stats={stats}
        onComplete={handleLessonComplete}
        onExit={() => {
          setLessonData(null);
          setCurrentView('home');
        }}
      />
    );
  }

  const selectedSubject = selectedSubjectId ? getSubjectById(selectedSubjectId) : null;

  return (
    <div className="min-h-screen bg-background">
      {currentView === 'home' && (
        <Dashboard
          stats={stats}
          onSelectSubject={handleSelectSubject}
          onStartDailyMix={handleStartDailyMix}
        />
      )}
      {currentView === 'learn' && selectedSubject && (
        <LearnView
          subject={selectedSubject}
          onBack={() => setCurrentView('home')}
          onStartLevel={handleStartLevel}
        />
      )}
      {currentView === 'leaderboard' && <LeaderboardView />}
      {currentView === 'quests' && <QuestsView />}
      {currentView === 'games' && <MiniGamesView stats={stats} />}
      {currentView === 'profile' && (
        <ProfileView user={user} stats={stats} onLogout={handleLogout} />
      )}
      <Navigation activeTab={currentView} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
