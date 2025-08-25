import { PassbuildSession } from '../session/passbuild-session.js';

class PassbuildSessionRegistry {
  private sessions = new Map<string, PassbuildSession>();

  createSession(id: string, code: string, username: string) {
    if (this.sessions.has(id))
      throw new Error('A session with the specified id already exists');

    const session = new PassbuildSession(id, code, username);
    this.sessions.set(id, session);

    return session;
  }

  getSession(id: string): PassbuildSession | null {
    return this.sessions.get(id) ?? null;
  }

  removeSession(id: string): boolean {
    return this.sessions.delete(id);
  }
}

export const passbuildSessionRegistry = new PassbuildSessionRegistry();
