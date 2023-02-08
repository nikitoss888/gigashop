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
    User.hasMany(ItemBought, {foreignKey: 'userId'});
    ItemBought.belongsTo(User, {foreignKey: 'userId'});

    User.hasMany(Wishlist, {foreignKey: 'userId'});
    Wishlist.belongsTo(User, {foreignKey: 'userId'});

    User.hasMany(ItemRate, {foreignKey: 'userId'});
    ItemRate.belongsTo(User, {foreignKey: 'userId'});

    Item.hasMany(ItemBought, {foreignKey: 'itemId'});
    ItemBought.belongsTo(Item, {foreignKey: 'itemId'});

    Item.hasMany(Wishlist, {foreignKey: 'itemId'});
    Wishlist.belongsTo(Item, {foreignKey: 'itemId'});

    Item.hasMany(ItemRate, {foreignKey: 'itemId'});
    ItemRate.belongsTo(Item, {foreignKey: 'itemId'});

    Company.hasMany(Item, {foreignKey: 'company_publisherId'});
    Item.belongsTo(Company, {foreignKey: 'company_publisherId'});

    Company.belongsToMany(Item, {through: ItemDevelopers});
    Item.belongsToMany(Company, {through: ItemDevelopers});

    Genre.belongsToMany(Item, {through: ItemGenre});
    Item.belongsToMany(Genre, {through: ItemGenre});

    Publication.hasMany(PublicationComment, {foreignKey: 'publicationId'});
    PublicationComment.belongsTo(Publication, {foreignKey: 'publicationId'});

    Publication.hasMany(PublicationTag, {foreignKey: 'publicationId'});
    PublicationTag.belongsTo(Publication, {foreignKey: 'publicationId'});

    User.hasMany(Publication, {foreignKey: 'userId'});
    Publication.belongsTo(User, {foreignKey: 'userId'});

    User.hasMany(PublicationComment, {foreignKey: 'userId'});
    PublicationComment.belongsTo(User, {foreignKey: 'userId'});
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