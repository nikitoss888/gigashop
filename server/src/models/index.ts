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
import PublicationTag from "./PublicationTag";
import PublicationComment from "./PublicationComment";

function initModels() {
    User.belongsToMany(Item, {through: ItemCart, foreignKey: 'userId', as: 'Cart'});
    Item.belongsToMany(User, {through: ItemCart, foreignKey: 'itemId', as: 'Users'});

    User.belongsToMany(Item, {through: Wishlist, foreignKey: 'userId', as: 'Wishlist'});
    Item.belongsToMany(User, {through: Wishlist, foreignKey: 'itemId', as: 'Users'});

    User.belongsToMany(Item, {through: ItemBought, foreignKey: 'userId', as: 'Bought'});
    Item.belongsToMany(User, {through: ItemBought, foreignKey: 'itemId', as: 'Users'});

    User.belongsToMany(Item, {through: ItemRate, foreignKey: 'userId', as: 'Rates'});
    Item.belongsToMany(User, {through: ItemRate, foreignKey: 'itemId', as: 'Users'});

    Company.hasMany(Item, {foreignKey: 'company_publisherId', as: 'ItemsPublished'});
    Item.belongsTo(Company, {foreignKey: 'company_publisherId', as: 'Publisher'});

    Company.belongsToMany(Item, {through: ItemDevelopers, as: 'ItemsDeveloped'});
    Item.belongsToMany(Company, {through: ItemDevelopers, as: 'Developers'});

    Genre.belongsToMany(Item, {through: ItemGenre, as: 'Items'});
    Item.belongsToMany(Genre, {through: ItemGenre, as: 'Genres'});

    Publication.belongsToMany(User, {through: PublicationComment, foreignKey: 'publicationId', as: 'Comments'});
    User.belongsToMany(Publication, {through: PublicationComment, foreignKey: 'userId', as: 'Publications'});

    Publication.hasMany(PublicationTag, {foreignKey: 'publicationId', as: 'Tags'});
    PublicationTag.belongsTo(Publication, {foreignKey: 'publicationId', as: 'Publication'});

    User.hasMany(Publication, {foreignKey: 'userId', as: 'Publications'});
    Publication.belongsTo(User, {foreignKey: 'userId', as: 'User'});
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