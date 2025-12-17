import { useFormik } from "formik";
import { z } from "zod";

const FilterSchema = z.object({
  q: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  category: z.string().optional(),
});

type FilterValues = z.infer<typeof FilterSchema>;

export default function FilterForm({ onFilter }: { onFilter: (values: FilterValues) => void }) {
  const formik = useFormik<FilterValues>({
    initialValues: { q: "", minPrice: 0, maxPrice: 0, category: "" },
    validate: (values) => {
      const parsed = FilterSchema.safeParse(values);
      if (!parsed.success) {
        const flattened = parsed.error.flatten().fieldErrors;
        return flattened;
      }
    },
    onSubmit: (values) => onFilter(values),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input name="q" value={formik.values.q} onChange={formik.handleChange} placeholder="Search" />
      <input type="number" name="minPrice" value={formik.values.minPrice} onChange={formik.handleChange} placeholder="Min Price" />
      <input type="number" name="maxPrice" value={formik.values.maxPrice} onChange={formik.handleChange} placeholder="Max Price" />
      <input name="category" value={formik.values.category} onChange={formik.handleChange} placeholder="Category" />
      <button type="submit">Filter</button>
    </form>
  );
}
