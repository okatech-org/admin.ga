'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { TOUR_STEPS, HELP_SHORTCUTS, CONTEXTUAL_HELP } from '@/lib/config/super-admin-navigation';
import { TourStep } from '@/lib/types/navigation';

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
}

const TourContext = createContext<TourContextType | null>(null);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

interface TourProviderProps {
  children: React.ReactNode;
}

export const TourProvider = ({ children }: TourProviderProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedBefore, setHasCompletedBefore] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait le tour
    const completed = localStorage.getItem('admin-ga-tour-completed');
    setHasCompletedBefore(!!completed);
  }, []);

  const startTour = useCallback(() => {
    setIsActive(true);
    setCurrentStep(0);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem('admin-ga-tour-completed', 'true');
    setHasCompletedBefore(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  }, [currentStep, endTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < TOUR_STEPS.length) {
      setCurrentStep(step);
    }
  }, []);

  const value: TourContextType = {
    isActive,
    currentStep,
    startTour,
    endTour,
    nextStep,
    prevStep,
    goToStep
  };

  return (
    <TourContext.Provider value={value}>
      {children}
      {isActive && <TourOverlay />}
      {!hasCompletedBefore && !isActive && <TourWelcomeCard />}
    </TourContext.Provider>
  );
};

const TourOverlay = () => {
  const { currentStep, nextStep, prevStep, endTour } = useTour();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [highlightPosition, setHighlightPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const currentTourStep = TOUR_STEPS[currentStep];

  useEffect(() => {
    if (currentTourStep?.target && currentTourStep.target !== 'body') {
      const element = document.querySelector(currentTourStep.target) as HTMLElement;
      setTargetElement(element);

      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightPosition({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        });

        // Scroll vers l'élément si nécessaire
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setTargetElement(null);
    }
  }, [currentStep, currentTourStep]);

  if (!currentTourStep) return null;

  const getTooltipPosition = () => {
    if (!targetElement) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const rect = targetElement.getBoundingClientRect();
    const tooltipWidth = 350;
    const tooltipHeight = 200;

    let top = rect.top;
    let left = rect.left;

    switch (currentTourStep.position) {
      case 'top':
        top = rect.top - tooltipHeight - 20;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'bottom':
        top = rect.bottom + 20;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.left - tooltipWidth - 20;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.right + 20;
        break;
    }

    // Ajustements pour rester dans l'écran
    if (left < 20) left = 20;
    if (left + tooltipWidth > window.innerWidth - 20) left = window.innerWidth - tooltipWidth - 20;
    if (top < 20) top = 20;
    if (top + tooltipHeight > window.innerHeight - 20) top = window.innerHeight - tooltipHeight - 20;

    return { top: `${top}px`, left: `${left}px` };
  };

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Highlight de l'élément cible */}
      {targetElement && (
        <div
          className="absolute bg-white/10 border-2 border-blue-400 rounded-lg shadow-2xl pointer-events-none"
          style={{
            left: highlightPosition.x - 4,
            top: highlightPosition.y - 4,
            width: highlightPosition.width + 8,
            height: highlightPosition.height + 8
          }}
        />
      )}

      {/* Tooltip avec contenu du tour */}
      <Card
        className="absolute w-[350px] shadow-2xl border-blue-200 bg-white"
        style={getTooltipPosition()}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Étape {currentStep + 1} sur {TOUR_STEPS.length}
            </Badge>
            <Button variant="ghost" size="sm" onClick={endTour}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardTitle className="text-lg">{currentTourStep.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">{currentTourStep.content}</p>

          <Progress value={(currentStep + 1) / TOUR_STEPS.length * 100} className="h-2" />

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Précédent
            </Button>

            <Button
              size="sm"
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {currentStep === TOUR_STEPS.length - 1 ? 'Terminer' : 'Suivant'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body
  );
};

const TourWelcomeCard = () => {
  const { startTour } = useTour();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Afficher la carte après un délai
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-4 duration-500">
      <Card className="w-80 shadow-2xl border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg">Bienvenue ! 👋</CardTitle>
          </div>
          <CardDescription>
            Première visite ? Laissez-nous vous guider dans ADMIN.GA
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            Interface conçue pour simplifier votre travail d'administration.
            Le tour guidé vous montrera toutes les fonctionnalités principales.
          </div>

          <div className="flex gap-2">
            <Button onClick={startTour} className="flex-1">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Commencer le tour
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsVisible(false)}
              className="px-3"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body
  );
};

// Composant d'aide contextuelle
interface ContextualHelpProps {
  page: string;
  className?: string;
}

export const ContextualHelp = ({ page, className }: ContextualHelpProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const helpContent = CONTEXTUAL_HELP[page];

  if (!helpContent) return null;

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        Aide
      </Button>

      {isOpen && (
        <Card className="absolute top-full right-0 mt-2 w-80 shadow-lg z-30 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Aide Contextuelle
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{helpContent}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Composant pour afficher les raccourcis
export const KeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <Card className="w-96 max-h-96 overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Raccourcis Clavier</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(HELP_SHORTCUTS).map(([shortcut, description]) => (
            <div key={shortcut} className="flex items-center justify-between">
              <span className="text-sm">{description}</span>
              <Badge variant="outline" className="font-mono text-xs">
                {shortcut}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>,
    document.body
  );
};
