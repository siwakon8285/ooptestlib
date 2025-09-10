
// Interface Borrowable
interface Borrowable {
  borrow(memberName: string): string;
  returnItem(): string;
  isAvailable(): boolean;
}

// Abstract class LibraryItem implementing Borrowable
abstract class LibraryItem implements Borrowable {
  private _title: string;
  protected itemId: string;
  private _available: boolean = true;

  constructor(title: string, itemId: string) {
    this._title = title;
    this.itemId = itemId;
    this._available = true;
  }

  // Getter for title
  public get title(): string {
    return this._title;
  }

  // Getter for itemId
  public getItemId(): string {
    return this.itemId;
  }

  // Setter for availability
  public available(available: boolean): void {
    this._available = available;
  }

  // Implementation of Borrowable
  public isAvailable(): boolean {
    return this._available;
  }

  public borrow(memberName: string): string {
    if (!this._available) {
      return `${this.getKind()} "${this._title}" is not available`;
    }
    this._available = false;
    return `${this.getKind()} ${this._title} borrowed by ${memberName}`;
  }

  public returnItem(): string {
    if (this._available) {
      return `${this.getKind()} "${this._title}" was not borrowed`;
    }
    this._available = true;
    return `${this.getKind()} ${this._title} returned`;
  }

  // Subclasses must implement
  public abstract getDetails(): string;
  protected abstract getKind(): string;
}

/* ---------- Subclasses ---------- */

// Book subclass
class Book extends LibraryItem {
  private author: string;

  constructor(title: string, itemId: string, author: string) {
    super(title, itemId);
    this.author = author;
  }

  public getDetails(): string {
    return `Book: ${this.title} by ${this.author} (ID: ${this.getItemId()})`;
  }

  protected getKind(): string {
    return "Book";
  }
}

// Magazine subclass
class Magazine extends LibraryItem {
  private issueDate: string;

  constructor(title: string, itemId: string, issueDate: string) {
    super(title, itemId);
    this.issueDate = issueDate;
  }

  public getDetails(): string {
    return `Magazine: ${this.title} (Issue: ${this.issueDate}) (ID: ${this.getItemId()})`;
  }

  protected getKind(): string {
    return "Magazine";
  }
}

// DVD subclass
class DVD extends LibraryItem {
  private durationMinutes: number;
  private director?: string;

  constructor(title: string, itemId: string, durationMinutes: number, director?: string) {
    super(title, itemId);
    this.durationMinutes = durationMinutes;
    this.director = director;
  }

  public getDetails(): string {
    const dir = this.director ? ` by ${this.director}` : "";
    return `DVD: ${this.title}${dir} (${this.durationMinutes} min) (ID: ${this.getItemId()})`;
  }

  protected getKind(): string {
    return "DVD";
  }
}

// LearningMedia subclass
class LearningMedia extends LibraryItem {
  private mediaType: string; // เช่น Video, Audio, eLearning
  private durationMinutes: number;

  constructor(title: string, itemId: string, mediaType: string, durationMinutes: number) {
    super(title, itemId);
    this.mediaType = mediaType;
    this.durationMinutes = durationMinutes;
  }

  public getDetails(): string {
    return `Learning Media: ${this.title} [${this.mediaType}] (${this.durationMinutes} min) (ID: ${this.getItemId()})`;
  }

  protected getKind(): string {
    return "Learning Media";
  }
}

// ResearchReport subclass
class ResearchReport extends LibraryItem {
  private author: string;
  private year: number;

  constructor(title: string, itemId: string, author: string, year: number) {
    super(title, itemId);
    this.author = author;
    this.year = year;
  }

  public getDetails(): string {
    return `Research Report: "${this.title}" by ${this.author} (${this.year}) (ID: ${this.getItemId()})`;
  }

  protected getKind(): string {
    return "Research Report";
  }
}

/* ---------- LibraryMember ---------- */

class LibraryMember {
  private _memberName: string;
  private _memberId: string;
  private _borrowedItems: LibraryItem[] = [];

  constructor(memberName: string, memberId: string) {
    this._memberName = memberName;
    this._memberId = memberId;
  }

  public get memberName(): string {
    return this._memberName;
  }

  public get memberId(): string {
    return this._memberId;
  }

  public borrowItem(item: LibraryItem): string {
    if (!item.isAvailable()) {
      return `Item ${item.getItemId()} not available`;
    }
    const msg = item.borrow(this._memberName);
    if (!item.isAvailable()) {
      this._borrowedItems.push(item);
    }
    return msg;
  }

  public returnItem(itemId: string): string {
    const idx = this._borrowedItems.findIndex(i => i.getItemId() === itemId);
    if (idx === -1) {
      return `Member ${this._memberName} does not have item ${itemId}`;
    }
    const item = this._borrowedItems[idx];
    const msg = item.returnItem();
    if (item.isAvailable()) {
      this._borrowedItems.splice(idx, 1);
    }
    return msg;
  }

  public listBorrowedItems(): string {
    if (this._borrowedItems.length === 0) {
      return `${this._memberName} has no borrowed items`;
    }
    const lines = this._borrowedItems.map(i => i.getDetails());
    return lines.join("\n");
  }
}

/* ---------- Library ---------- */

class Library {
  private items: LibraryItem[] = [];
  private members: LibraryMember[] = [];

  public addItem(item: LibraryItem): void {
    this.items.push(item);
  }

  public addMember(member: LibraryMember): void {
    this.members.push(member);
  }

  public findItemById(itemId: string): LibraryItem | undefined {
    return this.items.find(i => i.getItemId() === itemId);
  }

  public findMemberById(memberId: string): LibraryMember | undefined {
    return this.members.find(m => m.memberId === memberId);
  }

  public borrowItem(memberId: string, itemId: string): string {
    const member = this.findMemberById(memberId);
    if (!member) {
      return `Member ${memberId} not found`;
    }
    const item = this.findItemById(itemId);
    if (!item) {
      return `Item ${itemId} not found`;
    }
    return member.borrowItem(item);
  }

  public returnItem(memberId: string, itemId: string): string {
    const member = this.findMemberById(memberId);
    if (!member) {
      return `Member ${memberId} not found`;
    }
    const item = this.findItemById(itemId);
    if (!item) {
      return `Item ${itemId} not found`;
    }
    return member.returnItem(itemId);
  }

  public getLibrarySummary(): string {
    const itemLines = this.items.map(i => {
      const avail = i.isAvailable() ? "Available" : "Borrowed";
      return `${i.getDetails()} - ${avail}`;
    });
    const memberLines = this.members.map(m => `${m.memberName} (ID: ${m.memberId})`);
    return `Library Summary:\n\nItems:\n${itemLines.join("\n")}\n\nMembers:\n${memberLines.join("\n")}`;
  }
}

/* ---------- Example Usage ---------- */

const book = new Book("TypeScript Guide", "B001", "John Doe");
const magazine = new Magazine("Tech Monthly", "M001", "2023-09");
const dvd = new DVD("Learning TS", "D001", 120, "Jane Director");
const lm = new LearningMedia("Intro to AI", "LM001", "Video", 90);
const rr = new ResearchReport("AI in Education", "RR001", "Dr. Smith", 2024);

const member = new LibraryMember("Alice", "MEM001");
const library = new Library();

library.addItem(book);
library.addItem(magazine);
library.addItem(dvd);
library.addItem(lm);
library.addItem(rr);
library.addMember(member);

console.log(library.borrowItem("MEM001", "B001")); 
console.log(member.listBorrowedItems());
console.log(library.returnItem("MEM001", "B001"));
console.log(library.borrowItem("MEM001", "LM001"));
console.log(library.borrowItem("MEM001", "RR001"));
console.log("\n" + library.getLibrarySummary());