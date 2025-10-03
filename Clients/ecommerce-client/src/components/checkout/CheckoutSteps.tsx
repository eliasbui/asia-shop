'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Step {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface CheckoutStepsProps {
  steps: Step[];
  currentStep: string;
  onStepClick: (step: string) => void;
}

export function CheckoutSteps({ steps, currentStep, onStepClick }: CheckoutStepsProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const isStepCompleted = (stepIndex: number) => {
    return stepIndex < currentStepIndex;
  };

  const isStepCurrent = (stepId: string) => {
    return stepId === currentStep;
  };

  const canClickStep = (stepIndex: number) => {
    // Allow clicking on completed steps or current step
    return stepIndex <= currentStepIndex;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Button */}
            <Button
              variant={isStepCurrent(step.id) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => canClickStep(index) && onStepClick(step.id)}
              disabled={!canClickStep(index)}
              className={`
                relative w-10 h-10 rounded-full p-0
                ${isStepCompleted(index)
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : isStepCurrent(step.id)
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }
                ${canClickStep(index) ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
            >
              {isStepCompleted(index) ? (
                <Check className="w-4 h-4" />
              ) : (
                step.icon
              )}
            </Button>

            {/* Step Label */}
            <div className="ml-3">
              <p className={`
                text-sm font-medium
                ${isStepCurrent(step.id)
                  ? 'text-blue-600'
                  : isStepCompleted(index)
                    ? 'text-green-600'
                    : 'text-gray-400'
                }
              `}>
                {step.label}
              </p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`
                w-full h-0.5 mx-4
                ${isStepCompleted(index + 1)
                  ? 'bg-green-600'
                  : 'bg-gray-200'
                }
              `} />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}