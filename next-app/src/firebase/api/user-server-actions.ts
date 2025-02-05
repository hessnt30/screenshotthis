// "use server";

// // Create a reference to the cities collection
// import { adminDb } from "@/firebase/firebaseAdmin";
// import { ServersResponse } from "@/types";

// const serversRef = adminDb.collection("servers");

// // Create a query against the collection.
// export const getUserOwnedServers = async (uid: string) => {
//   console.log("Function called");

//   const querySnapshot = await serversRef.where("owner", "==", uid).get();

//   const servers: ServersResponse[] = querySnapshot.docs.map(
//     (doc) =>
//       ({
//         id: doc.id, // Use the document ID as part of the response
//         ...doc.data(), // Spread the document data
//       } as ServersResponse)
//   ); // Cast to ServerResponse type

//   return servers;
// };
