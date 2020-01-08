const db = require("../database/dbConfig.js");

module.exports = {
  findTransactionById,
  addTransaction,
  updateReturnTime
};

// Find transaction for a given id
async function findTransactionById(lender_id, google_book_id) {
  // get books where lender id and google book id match
  const transactions = await db("transactions").where({ lender_id, google_book_id });

  console.log(transactions);

  if (transactions.length > 1) {
    // return all available books, not returned yet
    transactions.reduce(tran => tran.return_time !== null);
  } else {
    return transactions;
  }
}

// Add a transaction history
async function addTransaction(transaction) {

  // get all matching transcations of lender, borrower, and google book
  const findDupTrans = await db("transactions").where({
    lender_id: transaction.lender_id,
    borrower_id: transaction.borrower_id,
    google_book_id: transaction.google_book_id
  });

  if (findDupTrans.length > 0) {
    //loop through for active transactions for non-returned books
    const openTrans = findDupTrans.filter(trans => trans.return_time === null);

    return openTrans;
  } else {
    // insert transaction
    const id = await db("transactions").insert(transaction).returning('id');
    // get new transcation info
    const newTransaction = await db("transactions").where('id');
    
    return newTransaction;
  }
}

// Update time stamp of return time
async function updateReturnTime(id) {
  await db("transactions")
    .where({ id })
    .update({ return_time: db.fn.now() });
  return findTransactionById(id);
}
