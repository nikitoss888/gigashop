import User from "./User";
import Item from "./Item";
import ItemRate from "./ItemRate";
import ItemGenre from "./ItemGenre";
import ItemBought from "./ItemBought";
import Wishlist from "./Wishlist";
import ItemCart from "./ItemCart";
import ItemDevelopers from "./ItemDevelopers";
import Company from "./Company";
import Genre from "./Genre";
import Publication from "./Publication";
import PublicationComment from "./PublicationComment";

function initModels() {
    User.belongsToMany(Item, {through: ItemCart, foreignKey: 'userId', as: 'Cart', onDelete: 'CASCADE'});
    Item.belongsToMany(User, {through: ItemCart, foreignKey: 'itemId', as: 'CartedUsers', onDelete: 'CASCADE'});

    User.belongsToMany(Item, {through: Wishlist, foreignKey: 'userId', as: 'Wishlist', onDelete: 'CASCADE'});
    Item.belongsToMany(User, {through: Wishlist, foreignKey: 'itemId', as: 'WishlistedUsers', onDelete: 'CASCADE'});

    User.hasMany(ItemBought, {foreignKey: 'userId', as: 'Bought', onDelete: 'CASCADE'});
    ItemBought.belongsTo(User, {foreignKey: 'userId', as: 'User', onDelete: 'CASCADE'});

    Company.hasMany(Item, {foreignKey: 'company_publisherId', as: 'ItemsPublished', onDelete: 'CASCADE'});
    Item.belongsTo(Company, {foreignKey: 'company_publisherId', as: 'Publisher', onDelete: 'CASCADE'});

    Company.belongsToMany(Item, {through: ItemDevelopers, as: 'ItemsDeveloped', onDelete: 'CASCADE'});
    Item.belongsToMany(Company, {through: ItemDevelopers, as: 'Developers', onDelete: 'CASCADE'});

    Genre.belongsToMany(Item, {through: ItemGenre, as: 'Items', onDelete: 'CASCADE'});
    Item.belongsToMany(Genre, {through: ItemGenre, as: 'Genres', onDelete: 'CASCADE'});

    ItemRate.belongsTo(User, {foreignKey: 'userId', as: 'User', onDelete: 'CASCADE'});
    User.hasMany(ItemRate, {foreignKey: 'userId', as: 'Rates', onDelete: 'CASCADE'});
    ItemRate.belongsTo(Item, {foreignKey: 'itemId', as: 'Item', onDelete: 'CASCADE'});
    Item.hasMany(ItemRate, {foreignKey: 'itemId', as: 'Rates', onDelete: 'CASCADE'});

    PublicationComment.belongsTo(User, {foreignKey: 'userId', as: 'User', onDelete: 'CASCADE'});
    User.hasMany(PublicationComment, {foreignKey: 'userId', as: 'CommentsList', onDelete: 'CASCADE'});
    PublicationComment.belongsTo(Publication, {foreignKey: 'publicationId', as: 'Publication', onDelete: 'CASCADE'});
    Publication.hasMany(PublicationComment, {foreignKey: 'publicationId', as: 'CommentsList', onDelete: 'CASCADE'});

    User.hasMany(Publication, {foreignKey: 'userId', as: 'Publications'});
    Publication.belongsTo(User, {foreignKey: 'userId', as: 'AuthoredUser'});
}

export default initModels;
export {
    User,
    Item,
    ItemRate,
    ItemGenre,
    ItemBought,
    Wishlist,
    ItemDevelopers,
    Company,
    Genre,
    Publication,
    PublicationComment,
};