import User from "./User";
import Item from "./Item";
import ItemRate from "./ItemRate";
import ItemGenre from "./ItemGenre";
import ItemBought from "./ItemBought";
import Wishlist from "./Wishlist";
import ItemDevelopers from "./ItemDevelopers";
import Company from "./Company";
import Genre from "./Genre";
import Publication from "./Publication";
import PublicationTag from "./PublicationTag";
import PublicationComment from "./PublicationComment";

function initModels() {
    User.hasMany(ItemBought, {foreignKey: 'userId', as: 'Bought'});
    ItemBought.belongsTo(User, {foreignKey: 'userId', as: 'User'});

    User.hasMany(Wishlist, {foreignKey: 'userId', as: 'Wishlists'});
    Wishlist.belongsTo(User, {foreignKey: 'userId', as: 'User'});

    User.hasMany(ItemRate, {foreignKey: 'userId', as: 'Rates'});
    ItemRate.belongsTo(User, {foreignKey: 'userId', as: 'User'});

    Item.hasMany(ItemBought, {foreignKey: 'itemId', as: 'Bought'});
    ItemBought.belongsTo(Item, {foreignKey: 'itemId', as: 'Item'});

    Item.hasMany(Wishlist, {foreignKey: 'itemId', as: 'Wishlists'});
    Wishlist.belongsTo(Item, {foreignKey: 'itemId', as: 'Item'});

    Item.hasMany(ItemRate, {foreignKey: 'itemId', as: 'Rates'});
    ItemRate.belongsTo(Item, {foreignKey: 'itemId', as: 'Item'});

    Company.hasMany(Item, {foreignKey: 'company_publisherId', as: 'ItemsPublished'});
    Item.belongsTo(Company, {foreignKey: 'company_publisherId', as: 'Publisher'});

    Company.belongsToMany(Item, {through: ItemDevelopers, as: 'ItemsDeveloped'});
    Item.belongsToMany(Company, {through: ItemDevelopers, as: 'Developers'});

    Genre.belongsToMany(Item, {through: ItemGenre, as: 'Items'});
    Item.belongsToMany(Genre, {through: ItemGenre, as: 'Genres'});

    Publication.hasMany(PublicationComment, {foreignKey: 'publicationId', as: 'Comments'});
    PublicationComment.belongsTo(Publication, {foreignKey: 'publicationId', as: 'Publication'});

    Publication.hasMany(PublicationTag, {foreignKey: 'publicationId', as: 'Tags'});
    PublicationTag.belongsTo(Publication, {foreignKey: 'publicationId', as: 'Publication'});

    User.hasMany(Publication, {foreignKey: 'userId', as: 'Publications'});
    Publication.belongsTo(User, {foreignKey: 'userId', as: 'User'});

    User.hasMany(PublicationComment, {foreignKey: 'userId', as: 'Comments'});
    PublicationComment.belongsTo(User, {foreignKey: 'userId', as: 'User'});
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
    PublicationTag,
    PublicationComment
};