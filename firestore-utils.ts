import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type WhereFilterOp,
  type DocumentData,
  type QueryConstraint,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase-config"

// Create a where constraint for queries
export function createWhereConstraint(field: string, operator: WhereFilterOp, value: any): QueryConstraint {
  return where(field, operator, value)
}

// Create an orderBy constraint for queries
export function createOrderByConstraint(field: string, direction: "asc" | "desc" = "asc"): QueryConstraint {
  return orderBy(field, direction)
}

// Create a limit constraint for queries
export function createLimitConstraint(limitCount: number): QueryConstraint {
  return limit(limitCount)
}

// Get a document by ID
export async function getDocumentById<T = DocumentData>(collectionName: string, id: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data() as T
      return { ...data, id: docSnap.id } as T
    }

    return null
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error)
    throw error
  }
}

// Get all documents from a collection
export async function getAllDocuments<T = DocumentData>(collectionName: string): Promise<T[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName))

    return querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id } as T
    })
  } catch (error) {
    console.error(`Error getting all documents from ${collectionName}:`, error)
    throw error
  }
}

// Query documents with constraints
export async function queryDocuments<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
): Promise<T[]> {
  try {
    const q = query(collection(db, collectionName), ...constraints)
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id } as T
    })
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error)
    throw error
  }
}

// Add a new document to a collection with auto-generated ID
export async function addDocument(collectionName: string, data: any): Promise<string> {
  try {
    // Add timestamps
    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Generate a new document reference with auto ID
    const docRef = await addDoc(collection(db, collectionName), docData)
    return docRef.id
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error)
    throw error
  }
}

// Set a document with a specific ID
export async function setDocument(collectionName: string, id: string, data: any, merge = false): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id)

    // Add timestamps
    const docData = {
      ...data,
      updatedAt: serverTimestamp(),
      ...(merge ? {} : { createdAt: serverTimestamp() }),
    }

    // Log the operation for debugging
    console.log(`Setting document in collection "${collectionName}" with ID "${id}":`, docData)

    await setDoc(docRef, docData, { merge })
  } catch (error) {
    console.error(`Error setting document in ${collectionName}:`, error)
    throw error
  }
}

// Update a document
export async function updateDocument(collectionName: string, id: string, data: any): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id)

    // Add updatedAt timestamp
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    }

    await updateDoc(docRef, updateData)
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error)
    throw error
  }
}

// Delete a document
export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error)
    throw error
  }
}

// Get courses with optional filtering
export async function getCourses(filters = {}): Promise<any[]> {
  try {
    const constraints: QueryConstraint[] = []

    // Add filters if provided
    if (filters) {
      Object.entries(filters).forEach(([field, value]) => {
        if (value !== undefined && value !== null) {
          constraints.push(createWhereConstraint(field, "==", value))
        }
      })
    }

    // Add default ordering by title
    constraints.push(createOrderByConstraint("title"))

    return queryDocuments("courses", constraints)
  } catch (error) {
    console.error("Error getting courses:", error)
    return []
  }
}

// Get modules for a course
export async function getModulesForCourse(courseId: string) {
  return queryDocuments("modules", [
    createWhereConstraint("courseId", "==", courseId),
    createOrderByConstraint("order"),
  ])
}

// Get lessons for a module
export async function getLessonsForModule(moduleId: string) {
  return queryDocuments("lessons", [
    createWhereConstraint("moduleId", "==", moduleId),
    createOrderByConstraint("order"),
  ])
}

// Get user progress for a course
export async function getUserProgress(userId: string, courseId: string) {
  const progressId = `${userId}_${courseId}`
  return getDocumentById("progress", progressId)
}

// Update user progress
export async function updateUserProgress(userId: string, courseId: string, data: any) {
  const progressId = `${userId}_${courseId}`
  const docRef = doc(db, "progress", progressId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return updateDocument("progress", progressId, data)
  } else {
    return setDocument("progress", progressId, {
      userId,
      courseId,
      ...data,
      startDate: new Date(),
      lastAccessDate: new Date(),
    })
  }
}

// Convert Firebase Timestamp to Date
export function timestampToDate(timestamp: Timestamp): Date {
  return timestamp.toDate()
}

// Convert Date to Firebase Timestamp
export function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date)
}
