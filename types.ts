export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  // Add other necessary properties
}

export type ChatMessage = Message;

export interface Chat {
  id: string;
  label?: string;
  messages: Message[];
  date: Date; // Add this line
  // Add other properties as needed
}
