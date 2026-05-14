interface IEcosystemActivities {
  id: string;
  user: string;
  action: string;
  target: string;
  type: 'project' | 'payment' | 'user';
  time: string; // Format waktu, misalnya "2 jam lalu"
}

export type { IEcosystemActivities };