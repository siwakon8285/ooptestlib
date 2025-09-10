// Borrowable interface
interface Borrowable {
  borrow(memberName: string): string;
  returnItem(): string;
  isAvailable(): boolean;
}

// Abstract LibraryItem class
abstract class LibraryItem implements Borrowable {
  private _title: string;
  protected itemId: string;
  private _available: boolean = true;

  constructor(title: string, itemId: string) {
    this._title = title;
    this.itemId = itemId;
  }

  // ✅ Getter for itemId (ใช้แทน itemId ตรงๆ)
  public get id(): string {
    return this.itemId;
  }

  // Getter for title
  public get title(): string {
    return this._title;
  }

  // Setter for availability
  public set available(value: boolean) {
    this._available = value;
  }

  // Implement isAvailable from Borrowable
  public isAvailable(): boolean {
    return this._available;
  }

  // Implement borrow from Borrowable
  public borrow(memberName: string): string {
    if (!this._available) {
      return `Item not available`;
    }
    this._available = false;
    return `${this._title} borrowed by ${memberName}`;
  }

  // Implement returnItem from Borrowable
  public returnItem(): string {
    if (this._available) {
      return `${this._title} was not borrowed`;
    }
    this._available = true;
    return `${this._title} returned`;
  }

  // Abstract method for subclasses to provide details
  public abstract getDetails(): string;
}

// Subclass: Book
class Book extends LibraryItem {
  private author: string;

  constructor(title: string, itemId: string, author: string) {
    super(title, itemId);
    this.author = author;
  }

  public getDetails(): string {
    return `Book: ${this.title} by ${this.author} (ID: ${this.id})`;
  }
}

// Subclass: Magazine
class Magazine extends LibraryItem {
  private issueDate: string;

  constructor(title: string, itemId: string, issueDate: string) {
    super(title, itemId);
    this.issueDate = issueDate;
  }

  public getDetails(): string {
    return `Magazine: ${this.title} (Issue: ${this.issueDate}) (ID: ${this.id})`;
  }
}

// Subclass: DVD
class DVD extends LibraryItem {
  private director: string;
  private durationMinutes: number;

  constructor(title: string, itemId: string, director: string, durationMinutes: number) {
    super(title, itemId);
    this.director = director;
    this.durationMinutes = durationMinutes;
  }

  public getDetails(): string {
    return `DVD: ${this.title} directed by ${this.director} (${this.durationMinutes} min) (ID: ${this.id})`;
  }
}


// ----------------------
// BorrowRecord
// ----------------------
class BorrowRecord {
  constructor(
    public item: LibraryItem,
    public borrowedDate: Date,
    public dueDate: Date
  ) {}
}

// ----------------------
// LibraryMember
// ----------------------
class LibraryMember {
  private _memberName: string;
  private _memberId: string;
  private _borrowedItems: BorrowRecord[] = [];

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

  // Borrow an item
  public borrowItem(item: LibraryItem, borrowDays: number = 7): string {
    if (!item.isAvailable()) {
      return `Item not available`;
    }
    const result = item.borrow(this._memberName);
    if (!result.startsWith("Item not available")) {
      const borrowedDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(borrowedDate.getDate() + borrowDays);

      this._borrowedItems.push(new BorrowRecord(item, borrowedDate, dueDate));
    }
    return result;
  }

  // Return an item by itemId
  public returnItem(itemId: string): string {
    const idx = this._borrowedItems.findIndex((r) => r.item.id === itemId);
    if (idx === -1) {
      return `Member does not have item with ID ${itemId}`;
    }
    const record = this._borrowedItems[idx];
    const result = record.item.returnItem();
    if (result.endsWith("returned")) {
      this._borrowedItems.splice(idx, 1);
    }
    return result;
  }

  // List borrowed items
  public listBorrowedItems(): string {
    if (this._borrowedItems.length === 0) {
      return `${this._memberName} has no borrowed items.`;
    }
    return this._borrowedItems
      .map(
        (r) =>
          `${r.item.getDetails()} | Borrowed: ${r.borrowedDate.toDateString()} | Due: ${r.dueDate.toDateString()}`
      )
      .join("\n");
  }
}

// ----------------------
// Library
// ----------------------
class Librarys {
  private items: LibraryItem[] = [];
  private members: LibraryMember[] = [];

  public addItem(item: LibraryItem): void {
    this.items.push(item);
  }

  public addMember(member: LibraryMember): void {
    this.members.push(member);
  }

  public findItemById(itemId: string): LibraryItem | undefined {
    return this.items.find((it) => it.id === itemId);
  }

  public findMemberById(memberId: string): LibraryMember | undefined {
    return this.members.find((m) => m.memberId === memberId);
  }

  // Borrow an item
  public borrowItem(memberId: string, itemId: string, borrowDays: number = 7): string {
    const member = this.findMemberById(memberId);
    if (!member) {
      return `Member with ID ${memberId} not found`;
    }
    const item = this.findItemById(itemId);
    if (!item) {
      return `Item with ID ${itemId} not found`;
    }
    return member.borrowItem(item, borrowDays);
  }

  // Return an item
  public returnItem(memberId: string, itemId: string): string {
    const member = this.findMemberById(memberId);
    if (!member) {
      return `Member with ID ${memberId} not found`;
    }
    const item = this.findItemById(itemId);
    if (!item) {
      return `Item with ID ${itemId} not found`;
    }
    return member.returnItem(itemId);
  }

  // Summary of library
  public getLibrarySummary(): string {
    const itemsSummary =
      this.items.length === 0
        ? "No items in library."
        : this.items
            .map(
              (it) => `${it.getDetails()} - ${it.isAvailable() ? "Available" : "Borrowed"}`
            )
            .join("\n");

    const membersSummary =
      this.members.length === 0
        ? "No members."
        : this.members
            .map((m) => `${m.memberName} (ID: ${m.memberId})`)
            .join("\n");

    return `Library Items:\n${itemsSummary}\n\nMembers:\n${membersSummary}`;
  }
}

// ----------------------
// Example usage / test
// ----------------------
const library = new Library();

const book = new Book("TypeScript Guide", "B001", "John Doe");
const magazine = new Magazine("Tech Monthly", "M001", "2023-09");
const dvd = new DVD("A Great Movie", "D001", "Jane Director", 120);

const memberAlice = new LibraryMember("Alice", "MEM001");
const memberBob = new LibraryMember("Bob", "MEM002");

library.addItem(book);
library.addItem(magazine);
library.addItem(dvd);

library.addMember(memberAlice);
library.addMember(memberBob);

console.log(library.borrowItem("MEM001", "B001", 10)); // Alice ยืมหนังสือ 10 วัน
console.log(library.borrowItem("MEM002", "B001"));     // Bob พยายามยืมเล่มเดียวกัน
console.log(memberAlice.listBorrowedItems());
console.log(library.returnItem("MEM001", "B001"));     // Alice คืน
console.log(library.borrowItem("MEM002", "B001", 5));  // Bob ยืมได้แล้ว
console.log(memberBob.listBorrowedItems());
console.log(library.getLibrarySummary());