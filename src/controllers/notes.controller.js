import { User } from '../models';
import { CustomErrorHandler } from '../services';
import Joi from 'joi';
import { nanoid } from 'nanoid'; 

const notesController = {
  /**
   * @method {post}
   * Save new note to the database
   * */
  async add(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.user._id });
      // convert data string to UTC
      const date = new Date(req.body.date).toUTCString();
      
      if (!user) {
        return next(CustomErrorHandler.unAuthorized());
      }

      const { id, title, description } = req.body;

      // add new note to the array of notes of the user
      user.notes.push({ id, title, description, date });

      await user.save();

      res.json({ message: 'Note Saved!' });
    } catch (err) {
      return next(err);
    }
  },

  /**
   * @method {get}
   * This method lists all the notes created by a particular user.
   * */
  async listAllNotes(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.user._id }).select(
        'username notes'
      );

      if (!user) {
        return next(CustomErrorHandler.unAuthorized());
      }

      res.json({ data: user });
    } catch (err) {
      return next(err);
    }
  },

  /**
   * @method {delete}
   * This method delets a note of  a particular user
   * */
  async delete(req, res, next) {
    try {
      const id = req.params.id; // note id

      const user = await User.findOne({ _id: req.user._id });

      if (!user) {
        return next(CustomErrorHandler.unAuthorized());
      }

      // return the deleted note
      const deleted = user.notes.map((item, index) => {
        if (item.id === parseInt(id)) {
          user.notes.splice(index, 1);
        }
      });

      if (!deleted) {
        console.log('Error Deleting: Maybe Incorrect Number');
      }

      await user.save();
      res.json({ message: 'ok', notes: user.notes });
    } catch (err) {
      return next(err);
    }
  },

  /**
   * @method {put}
   * Updates a note
   * */
  async update(req, res, next) {
    try {
      const id = req.params.id; // note id

      const { title, description } = req.body;

      User.findOneAndUpdate(
        {
          _id: req.user._id,
          'notes.id': parseInt(id),
        },
        {
          $set: {
            'notes.$.title': title,
            'notes.$.description': description,
          },
        },
        { new: true },
        (err, doc) => {
          if (err) {
            return next(new Error('Error Updating the user!'));
          }

          res.status(201).json({ message: 'Sucess!', data: doc.notes });
        }
      );
    } catch (err) {
      next(err);
    }
  },

  async all(req, res, next) {
    const user = await User.find();
    res.send(user);
  },

  /**
   * Generate a new shareable link for a post
  */
  async generateLink(req, res, next) {
    try {
      const id = req.params.id; // note id
      const shareableLink = nanoid();

      User.findOneAndUpdate(
        {
          _id: req.user._id,
          'notes.id': parseInt(id),
        },
        {
          $set: {
            'notes.$.sharelink': shareableLink
          },
        },
        { new: true },
        (err, doc) => {
          if (err) {
            return next(new Error('Error Updating shareable link!'));
          }

          res.status(201).json({ id: shareableLink });
        }
      );
    } catch (err) {
      next(err);
    }
  },

  async getNote(req, res, next) {
    try {
      const { password } = req.body;
      const { username, link } = req.params;

      const user = await User.findOne({ username });
      const post = user.notes.filter(note => note.sharelink === link);

      if (!password && post[0].password) {
        return res.json({msg: "Password Required"});
      }

      res.send(post);

    } catch (err) {
      next(err);
    }
  },
  async postGetNote(req, res, next) {
    try {
      const { password } = req.body;
      const { username, link } = req.params;

      const user = await User.findOne({ username });
      const post = user.notes.filter(note => note.sharelink === link);

      if (password === post[0].password) {
        return res.send(post);
      }

      throw new Error("Password didnt match");
    } catch (err) {
      next(err);
    }
  },

  async newpass(req, res, next) {
    try {
      const id = req.params.id; // note id
      const { newpassword } = req.body;

      User.findOneAndUpdate(
        {
          _id: req.user._id,
          'notes.id': parseInt(id),
        },
        {
          $set: {
            'notes.$.password': newpassword,
          },
        },
        { new: true },
        (err, doc) => {
          if (err) {
            return next(new Error('Error Updating the password!'));
          }

          res.status(201).json({ message: 'Sucess!', data: doc.notes });
        }
      );
    } catch (err) {
      next(err);
    }
  }
};

export default notesController;
