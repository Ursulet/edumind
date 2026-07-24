export interface VideoMeetingDetails {
  id: string;
  providerId: string;
  joinUrl: string;
  hostUrl?: string;
}

export interface VideoProvider {
  createMeeting(appointmentId: string, durationMin: number, topic: string): Promise<VideoMeetingDetails>;
  updateMeeting(providerId: string, durationMin: number, topic: string): Promise<boolean>;
  cancelMeeting(providerId: string): Promise<boolean>;
  getJoinInformation(providerId: string): Promise<{ joinUrl: string }>;
  getHostInformation(providerId: string): Promise<{ hostUrl: string }>;
}

export class MockVideoProvider implements VideoProvider {
  async createMeeting(appointmentId: string, durationMin: number, topic: string): Promise<VideoMeetingDetails> {
    const mockId = `mock_meet_${Date.now()}`;
    return {
      id: appointmentId,
      providerId: mockId,
      joinUrl: `/mock-video-call?role=guest&meeting_id=${mockId}`,
      hostUrl: `/mock-video-call?role=host&meeting_id=${mockId}`,
    };
  }

  async updateMeeting(providerId: string, durationMin: number, topic: string): Promise<boolean> {
    return true;
  }

  async cancelMeeting(providerId: string): Promise<boolean> {
    return true;
  }

  async getJoinInformation(providerId: string): Promise<{ joinUrl: string }> {
    return { joinUrl: `/mock-video-call?role=guest&meeting_id=${providerId}` };
  }

  async getHostInformation(providerId: string): Promise<{ hostUrl: string }> {
    return { hostUrl: `/mock-video-call?role=host&meeting_id=${providerId}` };
  }
}
