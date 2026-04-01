export default {
  name: 'trustedBy',
  title: 'Trusted By',
  type: 'document',
  fields: [
    { name: 'name', title: 'Client / Brand Name', type: 'string' },
    {
      name: 'logo',
      title: 'Logo Image',
      type: 'image',
      options: { hotspot: false },
      description: 'Upload a PNG with transparent background. Will be displayed in white.'
    },
    { name: 'order', title: 'Order', type: 'number' },
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
}
