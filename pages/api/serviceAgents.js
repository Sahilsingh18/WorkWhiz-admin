import { mongooseConnect } from '@/lib/mongoose';
import { ServiceAgent } from '@/models/ServiceAgent';

export default async function handle(req, res) {
  const { method } = req;

  await mongooseConnect();

  if (method === 'POST') {
    const { name, description, price, details, images, service, experience, gender, work } = req.body;

    const ServiceAgentDoc = await ServiceAgent.create({
      name,
      description,
      price,
      images,
      service,
      details,
      experience, gender, work
    })

    res.json(ServiceAgentDoc);
  }

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await ServiceAgent.findOne({ _id: req.query.id }));
    } else {

      res.json(await ServiceAgent.find());
    }
  }

  if (method === 'PUT') {
    const { name, description, price, details, images, service, experience, gender, work } = req.body;
    await ServiceAgent.updateOne({ _id }, {
      name, description, price, details, images, service, experience, gender, work
    });
    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await ServiceAgent.deleteOne({_id:req.query?.id});
      res.json(true)
    }
  }
}