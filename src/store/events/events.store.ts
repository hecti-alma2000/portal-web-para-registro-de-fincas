import { create } from "zustand";
import { Event } from "@/interfaces";
import { createEvent, deleteEvent, getAllEvents, updateEvent } from "@/actions";
import { SuccessAlert } from "@/components";

interface EventState {
  events: Event[];
  selectedEvent: Event | null;
  fetchEvents: () => Promise<void>;
  setSelectedEvent: (event: Event | null) => void;
  addEvent: (event: Event) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  selectedEvent: null,
  fetchEvents: async () => {
    const { events } = await getAllEvents();
    set({
      events: events
        ? events.map((event) => ({
            ...event,
            startDate: new Date(event.startDate).toISOString(),
            endDate: new Date(event.endDate).toISOString(),
            createdAt: new Date(event.createdAt).toISOString(), // Convertir Date a string
            updatedAt: new Date(event.updatedAt).toISOString(), // Convertir Date a string
          }))
        : [],
    });
  },

  setSelectedEvent: (event: Event | null) => set({ selectedEvent: event }),
  addEvent: async (event: Event) => {
    const { ok, data } = await createEvent(event);
    if (ok && data) {
      await SuccessAlert({ text: "Evento Creado Exitosamente" });
      set((state) => ({
        events: [
          ...state.events,
          {
            ...data,
            startDate: new Date(data.startDate).toISOString(),
            endDate: new Date(data.endDate).toISOString(),
            createdAt: new Date(data.createdAt).toISOString(), // Convertir Date a string
            updatedAt: new Date(data.updatedAt).toISOString(), // Convertir Date a string
          },
        ],
      }));
    }
  },

  updateEvent: async (event: Event) => {
    const { ok, data } = await updateEvent(event);
    if (ok && data) {
      await SuccessAlert({ text: "Evento Actualizado Exitosamente" });
      set((state) => ({
        events: state.events.map((e) =>
          e.id === data.id
            ? {
                ...data,
                startDate: new Date(data.startDate).toISOString(),
                endDate: new Date(data.endDate).toISOString(),
                createdAt: new Date(data.createdAt).toISOString(), // Convertir Date a string
                updatedAt: new Date(data.updatedAt).toISOString(), // Convertir Date a string
              }
            : e
        ),
      }));
    }
  },

  removeEvent: async (id: string) => {
    const result = await deleteEvent(id);
    if (result.ok) {
      set((state) => ({
        events: state.events.filter((event) => event.id !== id),
      }));
    }
  },
}));
