import * as Yup from 'yup';
import Doctor from '../models/Doctor';

class DoctorController {

    async index(req, res) {
        const { page = 1 } = req.query;
        const { limit = 40 } = req.query;
        await Doctor.paginate({}, { select: '_id doctor crm uf speciality', page, limit }).then((doctors) => {
            return res.json({
                error: false,
                doctors: doctors
            });
        }).catch((erro) => {
            return res.status(400).json({
                error: true,
                code: 106,
                message: "Erro: Não foi possível executar a solicitação!"
            });
        });
    };

    async show(req, res) {
        Doctor.findOne({ _id: req.params.id }, '_id doctor crm uf speciality createdAt updatedAt').then((doctor) => {
            console.log(doctor)
            return res.json({
                error: false,
                doctor: doctor
            });
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 107,
                message: "Erro: Não foi possível executar a solicitação!"
            })
        });
    };

    async insert(req, res) {

        const schema = Yup.object().shape({
            doctor: Yup.string().required(),
            uf: Yup.string().required(),
            crm: Yup.string().required(),
            speciality: Yup.string().required()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error: true,
                code: 103,
                message: "Error: Dados inválidos 2 !"
            });
        };

        const crmBd = await Doctor.findOne({ crm: req.body.crm });
        if (crmBd) {
            return res.status(400).json({
                error: true,
                code: 102,
                message: "Error: Este crm já está cadastrado!"
            });
        };

        var dados = req.body;

        const doctor = await Doctor.create(dados, (err) => {
            if (err) return res.status(400).json({
                error: true,
                code: 101,
                message: "Error: Médico não foi cadastrado com sucesso!"
            });

            return res.status(200).json({
                error: false,
                message: "Médico cadastrado com sucesso!",
                dados: doctor
            })
        });
    };

    async update(req, res) {
 
        const { _id, crm }= req.body;

        const doctorDb = await Doctor.findOne({_id: _id});

        if(!doctorDb){
            return res.status(400).json({
                error: true,
                code: 109,
                message: "Erro: Médico não encontrado!"
            });
        };

        if(crm != doctorDb.crm){
            const crmDb = await User.findOne({crm});
            if(crmDb){
                return res.status(400).json({
                    error: true,
                    code: 110,
                    message: "Erro: Este crm já está cadastrado!"
                });
            };
        };

        var dados = req.body;

        await Doctor.updateOne({_id: dados._id}, dados, (err) => {
            if(err) return res.status(400).json({
                error: true,
                code: 111,
                message: "Erro: Médico não foi editado com sucesso!"
            });

            return res.json({
                error: false,
                message: "Médico editado com sucesso!"
            });
        });        
    };

    async delete(req, res) {
        const doctorDb = await Doctor.findOne({ _id: req.params.id });

        if (!doctorDb) {
            return res.status(400).json({
                error: true,
                code: 104,
                message: "Erro: Médico não encontrado"
            });
        };

        const doctor = await Doctor.deleteOne({ _id: req.params.id }, (err) => {
            if (err) return res.status(400).json({
                error: true,
                code: 105,
                message: "Error: Médico não foi apagado com sucesso!"
            });
        });

        return res.json({
            error: false,
            message: "Médico apagado com sucesso!"
        });
    };
};

export default new DoctorController();