// Tipos auxiliares
export type CierreConversacion = "Vendido" | "Potable" | "No Vendido" | "No Potable";
export type Prioridad = "Alta" | "Media" | "Baja";
export type TipoPaquete = "Vuelo + Hotel" | "Solo Vuelo" | "All Inclusive" | "Tour";

// Interface principal de conversación
export interface Conversation {
  id: string; // chatId de Botmaker
  nombre: string; // Nombre del contacto
  telefono: string; // Número de teléfono
  destino: string; // Destino de viaje (variable de chat)
  tipoPaquete: TipoPaquete;
  fechaContacto: string; // ISO date
  horaContacto: number; // 0-23
  cantidadPasajeros: number;
  cantidadAdultos: number;
  cantidadNinos: number;
  prioridad: Prioridad;
  cantidadMensajes: number;
  cierreConversacion: CierreConversacion;
  linkChat: string; // URL a Botmaker
  agente: string; // Nombre del agente asignado
}

// Interface de agente
export interface Agent {
  id: string;
  name: string;
  email?: string;
  online?: boolean;
}

// Interface de filtros para el store de Zustand
export interface Filters {
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  agent?: string[];
  destination?: string[];
  status?: CierreConversacion[];
  priority?: Prioridad[];
  packageType?: TipoPaquete[];
  searchText?: string;
}
