import { useState, useCallback, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { WorkoutScreen } from './components/WorkoutScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { RestTimerBar } from './components/RestTimerBar';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { useRestTimer } from './hooks/useRestTimer';
import { useWakeLock } from './hooks/useWakeLock';
import { unlockAudio } from './lib/audio';

type Screen = 'home' | 'workout' | 'history';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  const {
    session,
    stats,
    startSession,
    updateSet,
    completeSet,
    uncompleteSet,
    finishSession,
    discardSession,
  } = useWorkoutSession();

  const {
    timerState,
    soundEnabled,
    setSoundEnabled,
    flashActive,
    start: startTimer,
    pause: pauseTimer,
    skip: skipTimer,
    addTime,
    changePreset,
  } = useRestTimer();

  // Screen Wake Lock while a workout session is active
  useWakeLock(session !== null);

  // One-time gesture audio unlock for iOS Safari / Chrome autoplay policy
  useEffect(() => {
    const handleGesture = () => {
      unlockAudio();
    };

    window.addEventListener('pointerdown', handleGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleGesture, { once: true, passive: true });
    window.addEventListener('click', handleGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('click', handleGesture);
    };
  }, []);

  const handleStartDay = useCallback(
    (dayId: string) => {
      startSession(dayId);
      setScreen('workout');
    },
    [startSession]
  );

  const handleResume = useCallback(() => {
    setScreen('workout');
  }, []);

  const handleCompleteSet = useCallback(
    (setId: string, restTarget: number) => {
      completeSet(setId);
      startTimer(restTarget);
    },
    [completeSet, startTimer]
  );

  const handleFinish = useCallback(() => {
    finishSession();
    skipTimer();
    setScreen('home');
  }, [finishSession, skipTimer]);

  const handleDiscard = useCallback(() => {
    discardSession();
    skipTimer();
    setScreen('home');
  }, [discardSession, skipTimer]);

  return (
    <main className="max-w-lg mx-auto relative min-h-[100dvh]">
      {screen === 'home' && (
        <HomeScreen
          activeDayId={session?.dayId ?? null}
          onStart={handleStartDay}
          onResume={handleResume}
          onViewHistory={() => setScreen('history')}
          timerActive={timerState.active}
        />
      )}

      {screen === 'workout' && session && stats && (
        <WorkoutScreen
          session={session}
          stats={stats}
          onUpdateSet={updateSet}
          onCompleteSet={handleCompleteSet}
          onUncompleteSet={uncompleteSet}
          onFinish={handleFinish}
          onDiscard={handleDiscard}
          onBack={() => setScreen('home')}
          timerActive={timerState.active}
        />
      )}

      {screen === 'history' && (
        <HistoryScreen
          onBack={() => setScreen('home')}
          timerActive={timerState.active}
        />
      )}

      {/* Global rest timer – visible on all screens when active */}
      <RestTimerBar
        timerState={timerState}
        soundEnabled={soundEnabled}
        flashActive={flashActive}
        setSoundEnabled={setSoundEnabled}
        onPause={pauseTimer}
        onSkip={skipTimer}
        onAddTime={addTime}
        onChangePreset={changePreset}
      />
    </main>
  );
}
