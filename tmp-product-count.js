require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const products = mongoose.connection.db.collection('products');
  const activeFilter = {
    $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }],
  };

  const visibilityMatch = {
    $and: [
      {
        $or: [
          { 'manufacturer.manufacturerStatus': { $exists: false } },
          { 'manufacturer.manufacturerStatus': null },
          { 'manufacturer.manufacturerStatus': 1 },
          { 'manufacturer.manufacturerStatus': true },
        ],
      },
      {
        $nor: [
          { 'manufacturer.vendor_status': 0 },
          { 'manufacturer.vendor_status': '0' },
          { 'manufacturer.vendor_status': false },
          { 'manufacturer.vendorStatus': 0 },
          { 'manufacturer.vendorStatus': '0' },
          { 'manufacturer.vendorStatus': false },
        ],
      },
    ],
  };

  const agg = await products
    .aggregate([
      {
        $match: {
          productStatus: 2,
          ...activeFilter,
          manufacturerId: { $exists: true, $ne: null },
          categoryId: { $exists: true, $ne: null },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      { $match: { 'category.category_status': 1 } },
      {
        $lookup: {
          from: 'manufacturers',
          localField: 'manufacturerId',
          foreignField: '_id',
          as: 'manufacturer',
        },
      },
      { $unwind: '$manufacturer' },
      { $match: visibilityMatch },
      { $count: 'count' },
    ])
    .toArray();

  console.log(JSON.stringify({ visibleCertified: agg[0]?.count ?? 0, rawStatus2: 98 }, null, 2));
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
