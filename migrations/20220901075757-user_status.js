module.exports = {
  async up(db, client){
    await db.collection('users').updateMany({},{$set:{user_status:'unblocked'}})
  },

  async down(db, client) {
    await db.collection('users').updateMany({}, {$unset: {user_status:'unblocked'}});
  }
};
