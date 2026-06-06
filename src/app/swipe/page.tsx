'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SwipeHUD } from '@/components/swipe/SwipeHUD';
import { ProgressIndicator } from '@/components/swipe/ProgressIndicator';
import { CardStack } from '@/components/swipe/CardStack';
import { ComboDisplay } from '@/components/swipe/ComboDisplay';
import { SwipeFeedbackLayer } from '@/components/swipe/SwipeFeedbackLayer';
import { XpBurst } from '@/components/swipe/XpBurst';
import { SessionSummary } from '@/components/swipe/SessionSummary';
import { useSwipeStore } from '@/stores/swipeStore';
import { findNodeByLessonId } from '@/data/roadmap';

function SwipeContent() {
  const searchParams = useSearchParams();
  const setRoadmapNodeId = useSwipeStore((s) => s.setRoadmapNodeId);

  useEffect(() => {
    const lessonId = searchParams.get('lesson');
    if (lessonId) {
      const node = findNodeByLessonId(lessonId);
      if (node) {
        setRoadmapNodeId(node.id);
      }
    } else {
      setRoadmapNodeId(null);
    }
  }, [searchParams, setRoadmapNodeId]);

  return (
    <div className="flex flex-col h-dvh relative">
      <SwipeHUD />
      <ProgressIndicator />

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        <div className="w-full mb-3 flex justify-center">
          <ComboDisplay />
        </div>

        <div className="w-full flex-1 flex items-center justify-center relative">
          <CardStack />
          <SwipeFeedbackLayer />
          <XpBurst />
        </div>
      </div>

      <div className="pb-safe-bottom" />

      <SessionSummary />
    </div>
  );
}

export default function SwipePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col h-dvh items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SwipeContent />
    </Suspense>
  );
}
