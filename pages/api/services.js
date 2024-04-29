import { mongooseConnect } from "@/lib/mongoose";
import { Service } from "@/models/Services";

export default async function handle(req, res) {
  const {method} = req;

  await mongooseConnect();

  if(method === 'POST') {
    const {name, parentService} = req.body;

    const serviceDoc = await Service.create({name, parent: parentService || undefined});
    res.json(serviceDoc)
  }

  if (method === 'GET') {
    res.json(await Service.find().populate('parent'))
  }

  if(method === 'PUT') {
    const {name, parentService, _id} = req.body;

    const serviceDoc = await Service.updateOne({_id}, {name, parent: parentService || undefined});
    res.json(serviceDoc)
  }

  if (method === 'DELETE') {
    const {_id} = req.query;
    await Service.deleteOne({_id});
    res.json('ok');
  }
}