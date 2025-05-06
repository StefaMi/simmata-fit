
import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface StatBoxProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  unit?: string;
  change?: string;
  changeDirection?: 'up' | 'down' | 'neutral';
  className?: string;
}

const StatBox = ({
  title,
  value,
  icon,
  unit,
  change,
  changeDirection = 'neutral',
  className = '',
}: StatBoxProps) => {
  return (
    <Card className={`fitness-stat-box ${className}`}>
      <div className="flex justify-between items-center w-full">
        <div className="bg-primary/10 p-2 rounded-full">
          {icon}
        </div>
        
        {change && (
          <div className="flex items-center">
            <span className={`text-xs font-medium ${
              changeDirection === 'up' 
                ? 'text-success' 
                : changeDirection === 'down' 
                  ? 'text-error' 
                  : 'text-muted-foreground'
            }`}>
              {change}
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-2 w-full">
        <p className="text-sm font-medium text-muted-foreground">
          {title}
        </p>
        <p className="text-2xl font-bold">
          {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
        </p>
      </div>
    </Card>
  );
};

export default StatBox;
