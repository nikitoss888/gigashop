import User from "./User";
import Item from "./Item";
import ItemTag from "./ItemTag";
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
import Tag from "./Tag";

function initModels() {
    User.belongsToMany(Item, {through: ItemCart, foreignKey: 'userId', as: 'Cart', onDelete: 'CASCADE'});
    Item.belongsToMany(User, {through: ItemCart, foreignKey: 'itemId', as: 'CartedUsers', onDelete: 'CASCADE'});

    User.belongsToMany(Item, {through: Wishlist, foreignKey: 'userId', as: 'Wishlist', onDelete: 'CASCADE'});
    Item.belongsToMany(User, {through: Wishlist, foreignKey: 'itemId', as: 'WishlistedUsers', onDelete: 'CASCADE'});

    User.belongsToMany(Item, {through: ItemBought, foreignKey: 'userId', as: 'Bought'});
    Item.belongsToMany(User, {through: ItemBought, foreignKey: 'itemId', as: 'BoughtUsers'});

    User.belongsToMany(Item, {through: ItemRate, foreignKey: 'userId', as: 'Rates', onDelete: 'CASCADE'});
    Item.belongsToMany(User, {through: ItemRate, foreignKey: 'itemId', as: 'RatedUsers', onDelete: 'CASCADE'});

    Company.hasMany(Item, {foreignKey: 'company_publisherId', as: 'ItemsPublished', onDelete: 'CASCADE'});
    Item.belongsTo(Company, {foreignKey: 'company_publisherId', as: 'Publisher'});

    Company.belongsToMany(Item, {through: ItemDevelopers, as: 'ItemsDeveloped', onDelete: 'CASCADE'});
    Item.belongsToMany(Company, {through: ItemDevelopers, as: 'Developers', onDelete: 'CASCADE'});

    Genre.belongsToMany(Item, {through: ItemGenre, as: 'Items', onDelete: 'CASCADE'});
    Item.belongsToMany(Genre, {through: ItemGenre, as: 'Genres', onDelete: 'CASCADE'});

    Item.belongsToMany(Tag, {through: ItemTag, as: 'Tags', onDelete: 'CASCADE'});
    Tag.belongsToMany(Item, {through: ItemTag, as: 'TaggedItems', onDelete: 'CASCADE'});

    Publication.belongsToMany(User, {through: PublicationComment, foreignKey: 'publicationId', as: 'Comments', onDelete: 'CASCADE'});
    User.belongsToMany(Publication, {through: PublicationComment, foreignKey: 'userId', as: 'CommentedPublications', onDelete: 'CASCADE'});

    Publication.belongsToMany(Tag, {through: PublicationTag, foreignKey: 'publicationId', as: 'Tags', onDelete: 'CASCADE'});
    Tag.belongsToMany(Publication, {through: PublicationTag, foreignKey: 'tagId', as: 'TaggedPublications', onDelete: 'CASCADE'});

    User.hasMany(Publication, {foreignKey: 'userId', as: 'Publications'});
    Publication.belongsTo(User, {foreignKey: 'userId', as: 'AuthoredUser'});
}

export default initModels;
export {
    User,
    Item,
    ItemTag,
    ItemRate,
    ItemGenre,
    ItemBought,
    Wishlist,
    ItemDevelopers,
    Company,
    Genre,
    Publication,
    PublicationTag,
    PublicationComment,
    Tag,
};