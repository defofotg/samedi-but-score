
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useSportsStore } from "@/stores/useSportsStore";
import {MatchCreationCommand} from "@/types/sports";

interface NewMatchDialogProps {}

const NewMatchDialog: React.FC<NewMatchDialogProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ date: '', teamA: '', teamB: '' });
  const addMatch = useSportsStore((state) => state.addMatch);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!form.date || !form.teamA || !form.teamB) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    const match: MatchCreationCommand = {
      date: new Date(form.date),
      teamA: form.teamA,
      teamB: form.teamB,
      isCompleted: false,
    };
    await addMatch(match);
    setForm({ date: '', teamA: '', teamB: '' });
    setIsOpen(false);
    toast.success("Match créé avec succès");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau match
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau match</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="date">Date du match</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={onChange}
            />
          </div>
          <div>
            <Label htmlFor="teamA">Nom de l’équipe A</Label>
            <Input
              id="teamA"
              name="teamA"
              placeholder="Nom de l'équipe A"
              value={form.teamA}
              onChange={onChange}
            />
          </div>
          <div>
            <Label htmlFor="teamB">Nom de l’équipe B</Label>
            <Input
              id="teamB"
              name="teamB"
              placeholder="Nom de l'équipe B"
              value={form.teamB}
              onChange={onChange}
            />
          </div>
          <Button onClick={handleCreate} className="w-full">
            Créer le match
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMatchDialog;
