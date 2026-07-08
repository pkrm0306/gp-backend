require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const products = mongoose.connection.db.collection('products');
  const activeFilter = {
    $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }],
  };

  const rowBase = [
    { $match: { ...activeFilter } },
    { $match: { productStatus: 2 } },
  ];

  const byStatus = await products
    .aggregate([...rowBase, { $group: { _id: '$productStatus', count: { $sum: 1 } } }])
    .toArray();

  const total = await products.aggregate([...rowBase, { $count: 'count' }]).toArray();

  console.log(JSON.stringify({ byStatus, total }, null, 2));
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
