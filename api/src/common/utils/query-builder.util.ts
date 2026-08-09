import { Query } from 'mongoose';

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query || {};
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.search as string;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
      } as any);
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['search', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    this.modelQuery = this.modelQuery.find(queryObj as any);
    return this;
  }

  sort() {
    const sort = (this.query.sort as string)?.split(',').join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  paginate() {
    const page = Math.max(1, Number(this.query.page) || 1);
    const limit = Math.max(1, Number(this.query.limit) || 10);
    this.modelQuery = this.modelQuery.skip((page - 1) * limit).limit(limit);
    return this;
  }

  fields() {
    const fields = (this.query.fields as string)?.split(',').join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const filter = this.modelQuery.getFilter();
    const filterKeys = Object.keys(filter);
    const isSimpleFilter =
      filterKeys.length === 0 || (filterKeys.length === 1 && filter.isDeleted === false);

    const total = isSimpleFilter
      ? await this.modelQuery.model.estimatedDocumentCount()
      : await this.modelQuery.model.countDocuments(filter);

    const page = Math.max(1, Number(this.query.page) || 1);
    const limit = Math.max(1, Number(this.query.limit) || 10);

    return {
      totalResult: total,
      currentPage: page,
      limit,
      totalPage: Math.ceil(total / limit),
    };
  }
}

export default QueryBuilder;
