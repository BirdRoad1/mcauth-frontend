import { PassbuildSession } from '../session/passbuild-session.js';

class PassbuildSessionRegistry {
  private sessions = new Map<string, PassbuildSession>();
  private readonly CLEANUP_DELAY_MS = 1 * 1000 * 60 * 60;
  private readonly EXPIRATION_SEC = 1 * 60 * 10;
  private didScheduleCleanup = false;

  createSession(id: string, code: string, username: string) {
    if (this.sessions.has(id))
      throw new Error('A session with the specified id already exists');

    const session = new PassbuildSession(id, code, username);
    this.sessions.set(id, session);

    return session;
  }

  getSession(id: string): PassbuildSession | null {
    const session = this.sessions.get(id) ?? null;
    if (session) {
      if (this.isExpired(session)) {
        this.sessions.delete(id);
        return null;
      }
    }

    return session;
  }

  removeSession(id: string): boolean {
    if (this.getSession(id) === null) return false; // return false for expired sessions
    return this.sessions.delete(id);
  }

  private isExpired(session: PassbuildSession) {
    return (
      Math.floor(Date.now() / 1000) - session.createdAt > this.EXPIRATION_SEC
    );
  }

  public scheduleCleanup() {
    if (this.didScheduleCleanup) return;
    this.didScheduleCleanup = true;
    const func = () => {
      this.cleanupTask();
      setTimeout(func, this.CLEANUP_DELAY_MS);
    };

    setTimeout(func, this.CLEANUP_DELAY_MS);
  }

  private cleanupTask() {
    for (const [id, session] of this.sessions) {
      if (this.isExpired(session)) {
        this.sessions.delete(id);
      }
    }
  }
}

export const passbuildSessionRegistry = new PassbuildSessionRegistry();
