import Dexie, { Table } from 'dexie';
import { User, ActivityLog, ClassSession, Announcement } from '../types';

export interface Member {
  id?: number;
  barcode: string;
  name: string;
  email: string;
  phone?: string;
  belt: string;
  stripes: number;
  joinedDate: Date;
  active: boolean;
  checkIns: number;
  lastCheckIn?: Date;
  notes?: string;
}

export interface CheckIn {
  id?: number;
  memberId: number;
  memberBarcode: string;
  memberName: string;
  timestamp: Date;
  classType?: string;
}

export class MatSharkDB extends Dexie {
  members!: Table<Member>;
  checkIns!: Table<CheckIn>;

  constructor() {
    super('MatSharkDB');
    
    this.version(1).stores({
      members: '++id, barcode, name, email, belt, active',
      checkIns: '++id, memberId, memberBarcode, timestamp'
    });
  }

  // Generate unique barcode
  generateBarcode(): string {
    const prefix = 'BJJ';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  // Member CRUD
  async addMember(member: Omit<Member, 'id' | 'barcode' | 'joinedDate' | 'checkIns'>): Promise<number> {
    const barcode = this.generateBarcode();
    const newMember: Member = {
      ...member,
      barcode,
      joinedDate: new Date(),
      checkIns: 0,
      active: true
    };
    return await this.members.add(newMember);
  }

  async getMemberByBarcode(barcode: string): Promise<Member | undefined> {
    return await this.members.where('barcode').equals(barcode).first();
  }

  async getMemberById(id: number): Promise<Member | undefined> {
    return await this.members.get(id);
  }

  async getAllMembers(): Promise<Member[]> {
    return await this.members.toArray();
  }

  async updateMember(id: number, changes: Partial<Member>): Promise<void> {
    await this.members.update(id, changes);
  }

  async deleteMember(id: number): Promise<void> {
    await this.members.delete(id);
  }

  // Check-in functions
  async checkIn(memberBarcode: string): Promise<{success: boolean; message: string; member?: Member}> {
    const member = await this.getMemberByBarcode(memberBarcode);
    
    if (!member) {
      return { success: false, message: 'Membro não encontrado' };
    }

    if (!member.active) {
      return { success: false, message: 'Membro inativo' };
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingCheckIn = await this.checkIns
      .where('memberBarcode')
      .equals(memberBarcode)
      .filter(checkIn => {
        const checkInDate = new Date(checkIn.timestamp);
        checkInDate.setHours(0, 0, 0, 0);
        return checkInDate.getTime() === today.getTime();
      })
      .first();

    if (existingCheckIn) {
      return { success: false, message: 'Check-in já realizado hoje', member };
    }

    // Create check-in
    const checkIn: CheckIn = {
      memberId: member.id!,
      memberBarcode: member.barcode,
      memberName: member.name,
      timestamp: new Date()
    };

    await this.checkIns.add(checkIn);

    // Update member stats
    await this.members.update(member.id!, {
      checkIns: (member.checkIns || 0) + 1,
      lastCheckIn: new Date()
    });

    return { success: true, message: 'Check-in realizado!', member };
  }

  async getTodayCheckIns(): Promise<CheckIn[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.checkIns
      .where('timestamp')
      .between(today, tomorrow)
      .toArray();
  }

  async getMemberCheckIns(memberId: number): Promise<CheckIn[]> {
    return await this.checkIns
      .where('memberId')
      .equals(memberId)
      .reverse()
      .toArray();
  }

  // Statistics
  async getStats(): Promise<{
    totalMembers: number;
    activeMembers: number;
    todayCheckIns: number;
    totalCheckIns: number;
  }> {
    const [totalMembers, activeMembers, todayCheckIns, totalCheckIns] = await Promise.all([
      this.members.count(),
      this.members.where('active').equals(1).count(),
      this.getTodayCheckIns().then(checkIns => checkIns.length),
      this.checkIns.count()
    ]);

    return {
      totalMembers,
      activeMembers,
      todayCheckIns,
      totalCheckIns
    };
  }
}

export const db = new MatSharkDB();
export default db;
