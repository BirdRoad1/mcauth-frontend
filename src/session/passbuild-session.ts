export type RegisterSessionStatus = 'CREATED' | 'BUILDING' | 'COMPLETE';

export class PassbuildSession {
  public status: RegisterSessionStatus = 'CREATED';
  readonly createdAt = Math.floor(Date.now() / 1000);
  public passbuild: string | undefined;

  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly username: string
  ) {}
}
