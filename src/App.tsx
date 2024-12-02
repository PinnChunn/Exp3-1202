import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import EventCard from './components/EventCard';
import EventDetail from './components/EventDetail';
import AuthModal from './components/AuthModal';
import SkillPaths from './components/SkillPaths';
import UserProfile from './components/UserProfile';
import Footer from './components/Footer';
import { getCurrentUser } from './lib/auth';
import { getEvents, registerForEvent, isUserRegistered } from './lib/events';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, [pathname]);

  return null;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
}

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [events] = useState(getEvents());

  useEffect(() => {
    const initApp = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        
        const registeredEventIds = events
          .filter(event => isUserRegistered(event.id, user.id))
          .map(event => event.id);
        setRegisteredEvents(registeredEventIds);
      }
    };

    initApp();
  }, [events]);

  const handleEventRegistration = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    
    if (!event) return;
    
    if (event.externalLink) {
      window.open(event.externalLink, '_blank', 'noopener,noreferrer');
      return;
    }

    if (!isAuthenticated) {
      setPendingEventId(eventId);
      setPendingAction('register');
      setIsAuthModalOpen(true);
      return;
    }

    if (user && event.id) {
      const { error } = await registerForEvent(event.id, user.id);
      if (!error) {
        setRegisteredEvents(prev => [...prev, event.id]);
      }
    }
  };

  const handleAuthSuccess = async () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    
    if (pendingAction === 'register' && pendingEventId && user) {
      const { error } = await registerForEvent(pendingEventId, user.id);
      if (!error) {
        setRegisteredEvents(prev => [...prev, pendingEventId]);
      }
      setPendingEventId(null);
      setPendingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              EXP3
            </Link>
            <UserProfile 
              isAuthenticated={isAuthenticated}
              user={user}
              onLogin={() => setIsAuthModalOpen(true)}
              onLogout={() => {
                setIsAuthenticated(false);
                setUser(null);
              }}
            />
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={
          <main className="pt-16">
            <Hero />
            <Benefits />

            <section id="events" className="py-20">
              <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Featured Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      {...event}
                      onRegister={() => handleEventRegistration(event.id)}
                      isAuthenticated={isAuthenticated}
                      isRegistered={registeredEvents.includes(event.id)}
                    />
                  ))}
                </div>
              </div>
            </section>

            <SkillPaths />
          </main>
        } />
        
        <Route path="/events/:id" element={
          <EventDetail
            onRegister={(eventId) => handleEventRegistration(eventId)}
            isAuthenticated={isAuthenticated}
            user={user}
          />
        } />
      </Routes>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingEventId(null);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
      />

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}