
export interface NotificationPack {
    id: number;
    clientId: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    notificationType: string;
    relatedPackId?: number;
  }