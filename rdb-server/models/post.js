const post = (sequelize, DataTypes) => {
  const Post = sequelize.define("post", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Post.associate = (models) => {
    Post.hasMany(models.Comment, { onDelete: "CASCADE" });
    Post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        foreignKey: "userId",
      },
    });
    Post.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: {
        name: "postId",
      },
    });
  };

  return Post;
};

export default post;
