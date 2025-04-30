
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, User } from "lucide-react";

type EquipmentType = 'bodyweight' | 'dumbbells' | 'barbell' | 'machine' | 'other';

type EquipmentSelectorProps = {
  onChange: (equipment: EquipmentType[]) => void;
  initialSelection?: EquipmentType[];
};

const EquipmentSelector = ({ onChange, initialSelection = [] }: EquipmentSelectorProps) => {
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType[]>(initialSelection);

  const equipmentOptions: { type: EquipmentType; label: string; icon: React.ReactNode }[] = [
    { type: 'bodyweight', label: 'Körpergewicht', icon: <User className="h-5 w-5" /> },
    { type: 'dumbbells', label: 'Hanteln', icon: <Dumbbell className="h-5 w-5" /> },
    { type: 'barbell', label: 'Langhantel', icon: <Dumbbell className="h-5 w-5 rotate-90" /> },
    { type: 'machine', label: 'Maschinen', icon: <Dumbbell className="h-5 w-5" /> },
    { type: 'other', label: 'Sonstiges', icon: <Dumbbell className="h-5 w-5" /> },
  ];

  const handleToggleEquipment = (type: EquipmentType) => {
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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-fitness-primary" />
          Verfügbare Ausrüstung auswählen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {equipmentOptions.map(option => (
            <Button
              key={option.type}
              variant={selectedEquipment.includes(option.type) ? "default" : "outline"}
              className={selectedEquipment.includes(option.type) 
                ? "bg-fitness-primary hover:bg-fitness-primary/90" 
                : "border-fitness-primary text-fitness-primary hover:bg-fitness-primary/10"
              }
              onClick={() => handleToggleEquipment(option.type)}
            >
              <div className="flex items-center gap-2">
                {option.icon}
                {option.label}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentSelector;
