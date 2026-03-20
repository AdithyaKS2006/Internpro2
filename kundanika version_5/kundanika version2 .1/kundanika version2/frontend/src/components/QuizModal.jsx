import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, CheckCircle2 } from 'lucide-react';

export default function QuizModal({ 
  isOpen, 
  onClose, 
  quiz, 
  step, 
  setStep, 
  currentIndex, 
  onNext, 
  result, 
  isLoading 
}) {
  const [selectedOption, setSelectedOption] = useState(null);

  // Reset selection when question changes
  useEffect(() => {
    setSelectedOption(null);
  }, [currentIndex]);

  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentIndex];
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {step === 0 && (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">{quiz.title}</DialogTitle>
              <DialogDescription className="text-center">
                Review your knowledge in {quiz.category}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center space-x-4 py-2">
              <Badge variant="secondary">{quiz.difficulty}</Badge>
              <Badge variant="secondary">{quiz.questions.length} Questions</Badge>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">{quiz.points} Points</Badge>
            </div>
            <div className="pt-4">
              <Button className="w-full" onClick={() => setStep(1)}>Start Assessment</Button>
            </div>
          </div>
        )}

        {step === 1 && currentQuestion && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium leading-tight">{currentQuestion.text}</h3>
              <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedOption === index ? "default" : "outline"}
                    className={`h-auto py-4 px-4 justify-start text-left whitespace-normal border-2 ${
                      selectedOption === index ? "border-blue-600 bg-blue-50 text-blue-900 hover:bg-blue-100" : "hover:border-blue-200"
                    }`}
                    onClick={() => setSelectedOption(index)}
                  >
                    <span className="mr-3 w-6 h-6 rounded-full border flex items-center justify-center text-xs shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                disabled={selectedOption === null || isLoading} 
                onClick={() => onNext(selectedOption)}
              >
                {isLoading ? "Submitting..." : currentIndex === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && result && (
          <div className="py-8 text-center space-y-6">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${result.score >= 80 ? 'bg-green-100' : 'bg-yellow-100'}`}>
              {result.score >= 80 ? (
                <Trophy className="h-8 w-8 text-green-600" />
              ) : (
                <CheckCircle2 className="h-8 w-8 text-yellow-600" />
              )}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Assessment Complete!</h2>
              <p className="text-gray-500">You scored {result.score}%</p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Points Earned</p>
                <p className="text-xl font-bold text-blue-600">+{result.points}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <p className="text-xl font-bold text-gray-900">{result.score >= 80 ? "Passed" : "Completed"}</p>
              </div>
            </div>

            {result.score >= 80 && (
              <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 py-2 px-3 rounded-lg text-sm font-medium">
                <Star className="h-4 w-4 fill-current" />
                <span>Quiz Master Badge Earned!</span>
              </div>
            )}

            <div className="pt-4">
              <Button className="w-full" onClick={onClose}>Return to Dashboard</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
