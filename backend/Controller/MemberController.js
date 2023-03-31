const { Member, Book, sequelize } = require("../models");
const { Op } = require("sequelize");
class MemberController {
  static async borrowBook(req, res, next) {
    try {
      const { memberName, title } = req.body;
      if (!memberName) {
        throw { status: 400, message: "please input member name" };
      }

      if (!title) {
        throw { status: 400, message: "please input title book" };
      }
      const findMember = await Member.findOne({
        where: {
          name: {
            [Op.iLike]: `%${memberName.trim()}%`,
          },
        },
        raw: true,
      });
      if (!findMember) {
        throw { status: 404, message: "member not found" };
      }
      if (findMember.totalBorrow >= 2) {
        throw { status: 400, message: "you already borrow 2 book" };
      }
      if (findMember.penalty) {
        let sunstactDate = new Date() - findMember.penalty;
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const differenceInDays = Math.floor(sunstactDate / millisecondsPerDay);
        if (differenceInDays <= 3) {
          throw { status: 400, message: "you are panalize" };
        }
      }

      const udapteBook = await Book.update(
        { MemberId: findMember.id, borrowDate: new Date() },
        {
          where: {
            MemberId: null,
            title: {
              [Op.iLike]: `%${title.trim()}%`,
            },
          },
        }
      );
      if (udapteBook[0] === 0) {
        throw { status: 400, message: "book already borrowed" };
      }
      await Member.update(
        { totalBorrow: sequelize.literal(`"totalBorrow" + 1`), penalty: null },
        {
          where: {
            id: findMember.id,
          },
        }
      );
      res.status(201).json({
        message: "book succesfully borrow",
      });
    } catch (error) {
      next(error);
    }
  }

  static async returnBook(req, res, next) {
    try {
      const { memberName, title } = req.body;
      if (!memberName) {
        throw { status: 400, message: "please input member name" };
      }
      if (!title) {
        throw { status: 400, message: "please input title book" };
      }
      const findBook = await Book.findOne({
        where: {
          title: {
            [Op.iLike]: `%${title.trim()}%`,
          },
        },
        raw: true,
      });
      if (!findBook) {
        throw { status: 404, message: "book not found" };
      }
      const findBorrow = await sequelize.query(
        `UPDATE "Books" SET "MemberId" = null FROM "Members" WHERE lower("Books".title) = '${title.toLowerCase()}' AND "Books"."MemberId" = "Members".id AND lower("Members".name) = ('${memberName.toLowerCase()}') Returning "borrowDate","Members".id;`
      );

      if (findBorrow[1].rowCount === 0) {
        throw { status: 400, message: "this is not the book you borrow" };
      }
      let sunstactDate = new Date() - findBorrow[0][0].borrowDate;
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const differenceInDays = Math.floor(sunstactDate / millisecondsPerDay);
      if (differenceInDays >= 7) {
        await Member.update(
          {
            penalty: new Date(),
            totalBorrow: sequelize.literal(`"totalBorrow" - 1`),
          },
          {
            where: {
              id: findBorrow[0][0].id,
            },
          }
        );
      } else {
        await Member.update(
          {
            totalBorrow: sequelize.literal(`"totalBorrow" - 1`),
          },
          {
            where: {
              id: findBorrow[0][0].id,
            },
          }
        );
      }
      res.status(201).json({
        message: "book succesfully return",
      });
    } catch (error) {
      next(error);
    }
  }

  static async allAvailableBook(req, res, next) {
    try {
      const allBookAvailable = await Book.findAll({
        where: {
          MemberId: null,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "MemberId", "borrowDate", "id"],
        },
        raw: true,
      });
      if (!allBookAvailable.length) {
        throw { status: 404, message: "no book available" };
      }
      res.status(200).json({
        data: allBookAvailable,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async allMember(req, res, next) {
    const allMember = await Member.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "penalty", "id"],
      },
      raw: true,
    });

    res.status(200).json({
      data: allMember,
    });
    try {
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MemberController;
