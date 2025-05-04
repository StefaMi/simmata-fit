
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Dumbbell, User } from "lucide-react";

type EquipmentType = 'bodyweight' | 'dumbbells' | 'barbell' | 'machine' | 'other';

type EquipmentSelectorProps = {
  onChange: (equipment: EquipmentType[]) => void;
  initialSelection?: EquipmentType[];
};

const EquipmentSelector = ({ onChange, initialSelection = [] }: EquipmentSelectorProps) => {
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType[]>(initialSelection);
  
  useEffect(() => {
    if (initialSelection.length > 0) {
      setSelectedEquipment(initialSelection);
    }
  }, [initialSelection]);

  const equipmentOptions: { type: EquipmentType; label: string; icon: React.ReactNode }[] = [
    { type: 'bodyweight', label: 'Körpergewicht', icon: <User className="h-5 w-5" /> },
    { type: 'dumbbells', label: 'Hanteln', icon: <Dumbbell className="h-5 w-5" /> },
    { type: 'barbell', label: 'Langhantel', icon: <Dumbbell className="h-5 w-5 rotate-90" /> },
    { type: 'machine', label: 'Maschinen', icon: <Dumbbell className="h-5 w-5" /> },
    { type: 'other', label: 'Sonstiges', icon: <Dumbbell className="h-5 w-5" /> },
  ];

  const handleToggleEquipment = (type: EquipmentType) => {
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
