export interface TestRelationsService {
  testRelations: () => Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
}
