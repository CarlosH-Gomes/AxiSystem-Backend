//ROTA USER

 /**
  * @swagger
  * tags:
  *   name: Usuario
  *   description: Cadastro e Login da aplicação
  */


/**
 * @swagger
 * components:
 *   schemas:
 *     signup:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - password
 *         - confirmPassword
 *       properties:
 *         email:
 *           type: string
 *           description: email do usuario
 *         name:
 *           type: string
 *           description: nome do usuario
 *         password:
 *           type: string
 *           description: senha do usuario
 *         confirmPassword:
 *           type: string
 *           description: confirma senha usuario
 *       example:
 *         email: 'exemplo@exemplo'
 *         name: exemplo
 *         password: senha
 *         confirmPassword: senha
 */


/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Criar novo usuario
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/signup'
 *     responses:
 *       200:
 *         description: Usuario cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/signup'
 *       400:
 *         description: Usuario ja cadastrado
 *       500:
 *         description: Erro no servidor
 *      
 */