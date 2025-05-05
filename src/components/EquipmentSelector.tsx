
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Dumbbell, User } from "lucide-react";

type EquipmentType = 'bodyweight' | 'dumbbells' | 'barbell' | 'machine' | 'other';

type EquipmentSelectorProps = {
  onChange: (equipment: string[]) => void;
  initialSelection?: string[];
};

const EquipmentSelector = ({ onChange, initialSelection = [] }: EquipmentSelectorProps) => {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  
  useEffect(() => {
    if (initialSelection && initialSelection.length > 0) {
      setSelectedEquipment(initialSelection);
    } else {
      setSelectedEquipment(['bodyweight', 'dumbbells']);
    }
  }, [initialSelection]);

  const equipmentOptions: { type: string; label: string; icon: React.ReactNode }[] = [
    { type: 'bodyweight', label: 'Körpergewicht', icon: <User className="h-5 w-5" /> },
    { type: 'dumbbells', label: 'Hanteln', icon: <Dumbbell className="h-5 w-5" /> },
    { type: 'barbell', label: 'Langhantel', icon: <Dumbbell className="h-5 w-5 rotate-90" /> },
    { type: 'machine', label: 'Maschinen', icon: <Dumbbell className="h-5 w-5" /> },
    { type: 'other', label: 'Sonstiges', icon: <Dumbbell className="h-5 w-5" /> },
  ];

  const handleToggleEquipment = (type: string) => {
    console.log(`Toggling equipment: ${type}`);
    
    setSelectedEquipment(prev => {
      const isSelected = prev.includes(type);
      const newSelection = isSelected 
        ? prev.filter(item => item !== type)
        : [...prev, type];
        
      // Inform parent component about the change
      onChange(newSelection);
      return newSelection;
    });
  };

  return (
    <Card className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 dark:text-white">
          <Dumbbell className="h-5 w-5 text-fitness-primary dark:text-fitness-accent" />
          Verfügbare Ausrüstung auswählen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {equipmentOptions.map(option => (
            <Toggle
              key={option.type}
              pressed={selectedEquipment.includes(option.type)}
              onPressedChange={() => handleToggleEquipment(option.type)}
              className="data-[state=on]:bg-fitness-primary data-[state=on]:text-white dark:data-[state=on]:bg-fitness-accent"
            >
              <div className="flex items-center gap-2">
                {option.icon}
                {option.label}
              </div>
            </Toggle>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentSelector;
