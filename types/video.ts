export type VideoSource = 'rayban' | 'uploaded';

export type VideoStatus = 'analyzed' | 'pending' | 'processing' | 'error';

export type GestureCategory = 
  | 'Cutting' 
  | 'Cooking / Searing' 
  | 'Plating / Dressing' 
  | 'Liquids / Deglazing' 
  | 'Herbs / Greens' 
  | 'Generic Upload';

export interface Video {
  id: string | number;
  title: string;
  source: VideoSource;
  duration: string; /* Format MM:SS, '0:00' if unknown */
  status: VideoStatus;
  date: string; /* e.g. "Today", "Yesterday", etc. */
  category: GestureCategory | null;
  thumbnailUrl: string | null;
  metaId: string | null;
}
