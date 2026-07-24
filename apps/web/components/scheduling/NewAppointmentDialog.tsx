"use client";

import { useState } from "react";
import { Dialog, DialogFooter, Button } from "@educariera/ui";

export function NewAppointmentDialog({ caseId, staffId, staffName }: { caseId: string, staffId: string, staffName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedSlot(null);
    if (!date) {
      setSlots([]);
      return;
    }
    
    setLoading(true);
    try {
      // typeId is hardcoded for demo, normally fetched from the system
      const res = await fetch(`/api/actions/scheduling/slots?staffId=${staffId}&date=${date}&typeId=default`);
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots || []);
      }
    } catch (e) {
      console.error("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot) return;
    setBooking(true);
    try {
      const res = await fetch("/api/actions/scheduling/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          staffId,
          date: selectedDate,
          time: selectedSlot,
          typeId: "default"
        })
      });
      if (res.ok) {
        setIsOpen(false);
        window.location.reload();
      } else {
        alert("Eroare la programare.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBooking(false);
    }
  };

  return (
    <>
      <Button className="bg-[#2F6B57] text-white hover:bg-[#275B4A]" onClick={() => setIsOpen(true)}>
        Programează Ședință Nouă
      </Button>

      <Dialog 
        open={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Programează o nouă ședință"
        className="bg-[#FFFDF8] border-[#E3DED3]"
      >
        <div className="grid gap-6 py-4">
          <p className="text-sm text-[#6B746F]">
            Specialist alocat: <span className="font-semibold text-[#1F2622]">{staffName}</span>
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1F2622]">Alege data dorită</label>
            <input 
              type="date" 
              className="w-full h-10 px-3 rounded-md border border-[#E3DED3] bg-white text-sm outline-none focus:border-[#2F6B57]"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {loading ? (
            <div className="text-sm text-[#6B746F] text-center py-4">Se caută disponibilitatea...</div>
          ) : selectedDate && slots.length === 0 ? (
            <div className="text-sm text-[#B4453A] bg-[#FEF2F2] p-3 rounded-md border border-[#FECACA] text-center">
              Nu există sloturi disponibile în această zi. Vă rugăm să alegeți altă dată.
            </div>
          ) : slots.length > 0 ? (
            <div className="space-y-3">
              <label className="text-sm font-medium text-[#1F2622]">Ore disponibile</label>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-1 text-sm rounded-md border transition-colors ${
                      selectedSlot === slot 
                        ? "bg-[#2F6B57] border-[#2F6B57] text-white font-medium" 
                        : "bg-white border-[#E3DED3] text-[#1F2622] hover:border-[#2F6B57]/50"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        
        <DialogFooter>
          <Button variant="outline" className="border-[#E3DED3] text-[#1F2622]" onClick={() => setIsOpen(false)}>
            Renunță
          </Button>
          <Button 
            className="bg-[#2F6B57] text-white hover:bg-[#275B4A]" 
            disabled={!selectedSlot || booking}
            onClick={handleBook}
          >
            {booking ? "Se procesează..." : "Confirmă Programarea"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
